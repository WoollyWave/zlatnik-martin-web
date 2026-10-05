<?php
declare(strict_types=1);

// ============================================================================
// Denní součty poptávek pro Signal Loop (push site_push.v1).
//   Běží z cronu hostingu MIMO public_html:
//     php ~/domains/zlatnik-martin.cz/signal-loop/push.php            → dny D−7..D−1
//     php ~/domains/zlatnik-martin.cz/signal-loop/push.php 2026-09-12 2026-10-04   → rozsah (backfill)
//   Čte jen stavy z ../form-log/RRRR-MM.ndjson (zapisuje public_html/send.php), nikdy jména,
//   e-maily ani texty poptávek. Ven jdou jen počty za den.
//   Tajemství je v souboru `secret` vedle skriptu (0600, mimo git); klíčem HMAC je jeho obsah.
// ============================================================================

const ENDPOINT   = 'https://app.vilim.sbs/api/v1/push/site/01a10bd1-a776-7246-8e57-61fe5d1f1cd2';
const SITE       = 'zlatnik';
const TZ         = 'Europe/Prague';
// Log je spolehlivý od 12. 9. 2026; 11. 9. jsou jen testy formuláře (changelog 11. 9. 2026).
const FIRST_DAY  = '2026-09-12';
const MAX_DAYS   = 31;          // strop jednoho pushe (schéma site_push.v1)
const RETRIES    = [0, 30, 120]; // odstup pokusů v sekundách při 5xx a chybě sítě

date_default_timezone_set(TZ);
$dir = __DIR__;
$logDir = dirname($dir) . '/form-log';

function out(string $msg): void {
    // Výstup skriptu i řádek do push.log (bez dat poptávek); log drží posledních 500 řádků.
    $line = date('c') . ' ' . $msg;
    fwrite(STDOUT, $line . "\n");
    $file = __DIR__ . '/push.log';
    $lines = is_file($file) ? file($file, FILE_IGNORE_NEW_LINES) : [];
    $lines[] = $line;
    @file_put_contents($file, implode("\n", array_slice($lines, -500)) . "\n", LOCK_EX);
}

/** Počty po dnech: odeslané a nedoručené poptávky z produkce, zachycené honeypotem. */
function counts(string $logDir, string $from, string $to): array {
    $days = [];
    for ($d = new DateTimeImmutable($from); $d->format('Y-m-d') <= $to; $d = $d->modify('+1 day')) {
        $days[$d->format('Y-m-d')] = ['inquiry_sent' => 0, 'inquiry_failed' => 0, 'form_rejected' => 0];
    }
    $months = array_unique(array_map(static fn(string $day): string => substr($day, 0, 7), array_keys($days)));
    foreach ($months as $month) {
        $file = "$logDir/$month.ndjson";
        if (!is_file($file)) {
            continue;
        }
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $raw) {
            $row = json_decode($raw, true);
            if (!is_array($row) || !is_string($row['t'] ?? null)) {
                continue;
            }
            $day = substr($row['t'], 0, 10);         // date('c') v Europe/Prague: den je prvních 10 znaků
            if (!isset($days[$day])) {
                continue;
            }
            $status = $row['s'] ?? '';
            $prod = (bool) preg_match('/(^|\.)zlatnik-martin\.cz(:[0-9]+)?$/i', (string) ($row['host'] ?? ''));
            if ($status === 'odeslano' && $prod) {
                $days[$day]['inquiry_sent']++;
            } elseif ($status === 'chyba' && $prod) {
                $days[$day]['inquiry_failed']++;
            } elseif ($status === 'honeypot') {      // honeypot host nezapisuje; staging tam téměř nechodí
                $days[$day]['form_rejected']++;
            }
        }
    }
    return $days;
}

function send(string $secret, array $payload): array {
    $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $code = 0;
    $resp = '';
    foreach (RETRIES as $wait) {
        if ($wait > 0) {
            sleep($wait);
        }
        $ts = (string) time();
        $sig = hash_hmac('sha256', $ts . '.' . $body, $secret);
        $ch = curl_init(ENDPOINT);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'X-Webhook-Timestamp: ' . $ts,
                'X-Webhook-Signature: v1=' . $sig,
            ],
        ]);
        $resp = (string) curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);   // curl_close netřeba (od PHP 8.0 nic nedělá)
        if ($code === 202 || $code === 409 || ($code >= 400 && $code < 500 && $code !== 429)) {
            break;                                      // přijato, už přijato, nebo chyba, kterou opakování nespraví
        }
    }
    return [$code, $resp];
}

$secret = trim((string) @file_get_contents("$dir/secret"));
if (!preg_match('/^[0-9a-f]{64}$/', $secret)) {
    out('chybí nebo je neplatný soubor secret');
    exit(2);
}
$yesterday = (new DateTimeImmutable('yesterday'))->format('Y-m-d');
$from = $argv[1] ?? (new DateTimeImmutable('-7 days'))->format('Y-m-d');
$to = $argv[2] ?? $yesterday;
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $from) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) {
    out('rozsah musí být RRRR-MM-DD RRRR-MM-DD');
    exit(2);
}
$from = max($from, FIRST_DAY);
$to = min($to, $yesterday);
if ($from > $to) {
    out("nic k odeslání ($from > $to)");
    exit(0);
}

$failed = false;
$days = counts($logDir, $from, $to);
foreach (array_chunk($days, MAX_DAYS, true) as $chunk) {
    $payload = [
        'schema_version' => 1,
        'site' => SITE,
        'generated_at' => gmdate('Y-m-d\TH:i:s\Z'),
        'tz' => TZ,
        'days' => [],
    ];
    foreach ($chunk as $day => $metrics) {
        $rows = [];
        foreach ($metrics as $metric => $value) {
            $rows[] = ['metric' => $metric, 'value' => $value];
        }
        $payload['days'][] = ['data_date' => $day, 'rows' => $rows];
    }
    [$code, $resp] = send($secret, $payload);
    $first = array_key_first($chunk);
    $last = array_key_last($chunk);
    $info = json_decode($resp, true);
    $detail = is_array($info) ? ($info['inbound_id'] ?? $info['code'] ?? '') : '';
    out("push $first..$last: HTTP $code $detail");
    $failed = $failed || !($code === 202 || $code === 409);
}
exit($failed ? 1 : 0);
