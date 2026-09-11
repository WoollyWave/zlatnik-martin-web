<?php
declare(strict_types=1);

// ============================================================================
// Contact form handler — zlatnik-martin.cz (Hostinger / LiteSpeed / PHP 8.1+,
// vyžaduje `never` return type; na 8.0 by soubor skončil parse errorem)
//   POST → odešle e-mail na RECIPIENT a vrátí JSON (fetch) nebo 303/HTML (bez JS).
//   Bezpečnost: Origin/Referer check, honeypot, rate-limit, header-injection guard.
//   Hlášky lokalizované podle skrytého pole `locale` (cs/en) z formuláře.
//   Tělo quoted-printable (žádný řádek > 76 zn.), subject dělený na encoded-words
//   ≤ 75 zn., jeden oddělovač řádků shodný s tím, který používá PHP mail().
// ============================================================================

// Čas v těle poptávky. Bez tohohle bere PHP `date.timezone` ze serveru (typicky UTC)
// a Martin vidí čas o 1–2 h posunutý. `declare` musí zůstat první, proto až tady.
date_default_timezone_set('Europe/Prague');

// Warning (např. „Array to string conversion") by se jinak vypsal před JSON
// a prozradil absolutní cestu na disku. log_errors bez pevné cesty NEZAPÍNAT:
// hosting by mohl psát public_html/error_log, který .htaccess neblokuje.
ini_set('display_errors', '0');

const RECIPIENT      = 'zlatnikmartin@email.cz';
const SENDER_FROM    = 'formular@zlatnik-martin.cz'; // viz POZNÁMKA v CLAUDE.md — musí existovat na doméně
const SENDER_NAME    = 'Web zlatnik-martin.cz';

// Obálkový odesílatel (SMTP MAIL FROM = Return-Path) pro 5. parametr mail().
// '' = beze změny chování (obálku dosadí sendmail wrapper hostingu, nedoručenky
// jdou do prázdna). Nastavit na SENDER_FROM AŽ PO MĚŘENÍ podle rozhodovacího
// postupu (Received přes relay v SPF + Return-Path mimo doménu → zapnout;
// odchod přímo z 147.93.92.199 nebo spf=softfail → nechat prázdné).
// Nikdy sem nedávat e-mail zákazníka (backscatter).
const ENVELOPE_FROM  = '';

// Produkce + staging (stejný build běží na obou). Prohlížeč Origin nezfalšuje,
// honeypot + rate-limit platí vždy.
const ALLOWED_ORIGINS = [
    'https://www.zlatnik-martin.cz',
    'https://web.vilim.sbs',
];
const RATE_LIMIT_SEC     = 30;
const MAX_NAME           = 120;
const MAX_EMAIL          = 200;
const MAX_PHONE          = 40;
const MAX_MESSAGE        = 5000;
const SUBJECT_NAME_CHARS = 60;   // delší jméno se v předmětu zkrátí, plné je v těle
const LOG_RETENTION_DAYS = 90;   // form-log; zásady OOÚ dovolují až 3 roky

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

// Oddělovač řádků, který PHP mail() samo použije pro To:, Subject: a konec hlaviček
// (php-src mail.c — 8.1: vždy CRLF; 8.2+: LF jen při mail.mixed_lf_and_crlf=On).
// Naše hlavičky i tělo musí používat TENTÝŽ. Míchat se nesmí: Exim bere holé LF
// za CRLF prvním řádkem jako pokračování hlavičky a (4.98+) v těle jako mezeru.
$nl = filter_var(ini_get('mail.mixed_lf_and_crlf'), FILTER_VALIDATE_BOOLEAN) ? "\n" : "\r\n";

// Lokalizace odpovědí — jazyk z formuláře (fallback cs). %s v send_failed = RECIPIENT.
$locale = (($_POST['locale'] ?? 'cs') === 'en') ? 'en' : 'cs';

// AJAX fetch posílá `Accept: application/json`; nativní POST bez JS čeká HTML.
// Bez téhle větve viděl návštěvník s vypnutým JS surové JSON místo poděkování.
$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
$formPage  = $locale === 'en' ? '/en/contact/' : '/kontakt/';
$MESSAGES = [
    'cs' => [
        'invalid_origin' => 'Neplatný původ požadavku.',
        'sent'           => 'Děkuji, zpráva byla odeslána.',
        'rate_limit'     => 'Zpráva byla nedávno odeslána. Zkuste to prosím za chvíli.',
        'name_required'  => 'Vyplňte prosím své jméno.',
        'email_invalid'  => 'Zadejte platnou e-mailovou adresu.',
        'phone_long'     => 'Telefonní číslo je příliš dlouhé.',
        'message_long'   => 'Zpráva je příliš dlouhá.',
        'gdpr_required'  => 'Pro odeslání je nutné odsouhlasit zpracování osobních údajů.',
        'invalid_input'  => 'Neplatný formát vstupu.',
        'send_failed'    => 'Zprávu se nepodařilo odeslat. Napište prosím přímo na %s.',
        'success'        => 'Děkuji, zpráva dorazila. Ozvu se do 24 hodin. Když spěcháte, zavolejte na +420 774 598 181.',
        'nojs_copy'      => 'Váš text, zkopírujte si ho, než se vrátíte:',
        'nojs_back'      => 'Zpět na formulář',
    ],
    'en' => [
        'invalid_origin' => 'Invalid request origin.',
        'sent'           => 'Thank you, your message has been sent.',
        'rate_limit'     => 'A message was sent recently. Please try again in a moment.',
        'name_required'  => 'Please enter your name.',
        'email_invalid'  => 'Please enter a valid email address.',
        'phone_long'     => 'The phone number is too long.',
        'message_long'   => 'The message is too long.',
        'gdpr_required'  => 'Please agree to the processing of personal data.',
        'invalid_input'  => 'Invalid input format.',
        'send_failed'    => 'The message could not be sent. Please write directly to %s.',
        'success'        => 'Thank you, your message has arrived. I will reply within 24 hours. If it is urgent, call +420 774 598 181.',
        'nojs_copy'      => 'Your message, copy it before going back:',
        'nojs_back'      => 'Back to the form',
    ],
];
$M = $MESSAGES[$locale];

/** Pole z POST jako řetězec; null = přišlo pole (name[]=…), ne řetězec.
 *  Explicitní (string) na poli dává E_WARNING „Array to string conversion"
 *  a hodnotu 'Array', která projde validací a odejde Martinovi jako jméno. */
function post_str(string $key): ?string {
    $v = $_POST[$key] ?? '';
    return is_string($v) ? trim($v) : null;
}

/** RFC 2047 §2: encoded-word ≤ 75 znaků. 10 ("=?UTF-8?B?") + 60 (base64 ze 45 B) + 2 ("?=") = 72.
 *  Slova oddělená jednou mezerou na jednom řádku, bez skládání — PHP mail() by CR poslalo
 *  do roury a holé LF nahradí mezerou, výsledek by byl stejný. Dělí se na hranici
 *  UTF-8 znaku. Čisté ASCII se nekóduje. */
function encode_header_utf8(string $text): string {
    if (!preg_match('/[^\x20-\x7E]/', $text)) {
        return $text;
    }
    $words = [];
    $chunk = '';
    foreach (mb_str_split($text, 1, 'UTF-8') as $ch) {
        if (strlen($chunk) + strlen($ch) > 45) {
            $words[] = $chunk;
            $chunk = '';
        }
        $chunk .= $ch;
    }
    if ($chunk !== '') {
        $words[] = $chunk;
    }
    return implode(' ', array_map(
        static fn(string $w): string => '=?UTF-8?B?' . base64_encode($w) . '?=',
        $words
    ));
}

/** Serverový záznam výsledku (NDJSON, mimo public_html). mail() vrací true, když
 *  zprávu převzal MTA, ne když dorazila — bez logu se poptávka odmítnutá na cestě
 *  ztratí beze stopy. Obsah zprávy se ukládá, aby šla obnovit. Retence 90 dní. */
function form_log(string $status, array $extra = []): void {
    $dir = dirname(__DIR__) . '/form-log';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $line = json_encode(['t' => date('c'), 's' => $status] + $extra,
        JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE) . "\n";
    // Nezapisovatelný adresář = tiše nic. Záznam je záchranná síť, ne podmínka odeslání,
    // a error_log() by na hostingu mohl skončit jako veřejný public_html/error_log.
    @file_put_contents($dir . '/' . date('Y-m') . '.ndjson', $line, FILE_APPEND | LOCK_EX);
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . '/*.ndjson') ?: [] as $f) {
            if (filemtime($f) < time() - LOG_RETENTION_DAYS * 86400) {
                @unlink($f);
            }
        }
    }
}

function respond(bool $ok, string $msg, int $code = 200): never {
    global $wantsJson, $formPage, $locale, $M;
    if (!$wantsJson) {
        if ($ok || $code === 405) {
            // 303 See Other → zpět na stránku formuláře; fragment zobrazí statickou
            // hlášku přes CSS :target (viz ContactForm.astro), žádný JS není potřeba.
            // 405 = někdo otevřel /send.php v prohlížeči → jen zpět na formulář.
            http_response_code(303);
            header('Location: ' . $formPage . ($ok ? '#form-sent' : ''));
            exit;
        }
        // Chyba bez JS (422/429/500): ŽÁDNÉ 303 na prázdný formulář — text poptávky
        // by zmizel přesně ve chvíli, kdy hláška posílá zákazníka napsat e-mail.
        // Konkrétní důvod + jeho text ke zkopírování. U 403 (cizí původ) se nic nereflektuje.
        $e   = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
        $raw = $_POST['message'] ?? '';
        $text = ($code === 403 || !is_string($raw)) ? '' : trim($raw);
        http_response_code($code);
        header('Content-Type: text/html; charset=utf-8');
        echo '<!doctype html><html lang="' . $locale . '"><head><meta charset="utf-8">'
           . '<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
           . '<title>' . $e($msg) . '</title></head>'
           . '<body style="font:16px/1.5 system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem">'
           . '<p role="alert"><strong>' . $e($msg) . '</strong></p>'
           . ($text !== ''
               ? '<p>' . $e($M['nojs_copy']) . '</p><textarea readonly rows="10" style="width:100%">' . $e($text) . '</textarea>'
               : '')
           . '<p><a href="mailto:' . RECIPIENT . '">' . RECIPIENT . '</a> · <a href="tel:+420774598181">+420 774 598 181</a></p>'
           . '<p><a href="' . $formPage . '#form">' . $e($M['nojs_back']) . '</a></p>'
           . '</body></html>';
        exit;
    }
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($code);
    echo json_encode(
        $ok ? ['ok' => true, 'message' => $msg] : ['ok' => false, 'error' => $msg],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

// --- 1) Pouze POST ---------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

// --- 2) Origin / Referer (basic CSRF) --------------------------------------
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
// Origin = přesná shoda (jen schéma+host, bez cesty). Referer = hranice hostu
// (koncové '/'), aby prefixová shoda nepropustila `…zlatnik-martin.cz.attacker.com`.
$valid = false;
foreach (ALLOWED_ORIGINS as $allowed) {
    if (($origin !== '' && $origin === $allowed)
     || ($referer !== '' && str_starts_with($referer, $allowed . '/'))) {
        $valid = true;
        break;
    }
}
if (!$valid) {
    respond(false, $M['invalid_origin'], 403);
}

// Produkce vs. staging. Bez tohohle rozlišení dorazí testovací odeslání ze
// stagingu do Martinovy schránky jako plnohodnotná poptávka a nejde je od
// skutečné odlišit — jediným vodítkem by byla IP, kterou nikdo nekontroluje.
$host    = $_SERVER['HTTP_HOST'] ?? '';
$isProd  = (bool) preg_match('/(^|\.)zlatnik-martin\.cz(:[0-9]+)?$/i', $host);

// --- 3) Honeypot — tichý úspěch pro boty -----------------------------------
$hp = post_str('website');
if ($hp === null) {
    respond(false, $M['invalid_input'], 400);
}
if ($hp !== '') {
    form_log('honeypot');
    respond(true, $M['sent']);
}

// --- 4) Rate-limit (file-based, per IP / per IPv6 prefix) -------------------
// Klíč: IPv4 beze změny; ::ffff:a.b.c.d → a.b.c.d (jinak by všichni IPv4 klienti
// sdíleli jeden bucket a jeden 30s zámek); nativní IPv6 → prefix /64 (jinak má
// útočník s běžným /64 2^64 „různých" adres).
$ip     = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$bucket = $ip;
$bin    = @inet_pton($ip);
if ($bin !== false && strlen($bin) === 16) {
    $bucket = str_starts_with($bin, str_repeat("\0", 10) . "\xff\xff")
        ? (string) inet_ntop(substr($bin, 12))
        : bin2hex(substr($bin, 0, 8));
}
// Adresář mimo public_html (sys_get_temp_dir() se periodicky čistí a nikdo nevidí,
// že limiter přestal fungovat). Když se nedá vytvořit, padá se na temp.
$rateDir = dirname(__DIR__) . '/form-ratelimit';
// Druhé is_dir() po neúspěšném mkdir(): při souběhu dva požadavky zjistí, že adresář
// chybí, jeden ho založí a druhému mkdir() selže. Bez nové kontroly by druhý spadl
// na temp — jiný zámek, jiná doména — a prošel by (sandbox 11. 9. 2026: 2 z 8).
if (!is_dir($rateDir) && !@mkdir($rateDir, 0700, true) && !is_dir($rateDir)) {
    $rateDir = sys_get_temp_dir();
}
$rateFile = $rateDir . '/zm_form_' . md5($bucket) . '.lock';
// Rychlá cesta bez zámku. Atomické razítko je až těsně před mail() (níž).
if (is_file($rateFile) && (time() - (int) filemtime($rateFile)) < RATE_LIMIT_SEC) {
    respond(false, $M['rate_limit'], 429);
}
// POZOR: razítko schválně AŽ za validací, ne tady. Když se orazítkuje před
// validací, zákazník s překlepem v e-mailu dostane 422 a jeho oprava do 30 s
// narazí na 429 — ztracená poptávka. Boty odfiltruje Origin check a honeypot výš.

// --- 5) Validace -----------------------------------------------------------
$name    = post_str('name');
$email   = post_str('email');
$phone   = post_str('phone');
$message = post_str('message');
if (in_array(null, [$name, $email, $phone, $message], true)) {
    respond(false, $M['invalid_input'], 400);
}
$gdpr = is_string($_POST['gdpr'] ?? null);

// Neplatné UTF-8 (jen z ručně sestaveného požadavku) nahradit, ne odmítnout —
// poptávka se nesmí ztratit kvůli jednomu bajtu. Zároveň pojistka pro preg /u níž.
[$name, $email, $phone, $message] = array_map(
    static fn(string $s): string => mb_scrub($s, 'UTF-8'),
    [$name, $email, $phone, $message]
);

// --- 6) Header-injection guard — hned, dřív než úklid níž, který by pokus zamaskoval.
// CR/LF/NUL v poli jdoucím do hlaviček je útok, ne překlep → 400.
foreach ([$name, $email, $phone] as $v) {
    if (preg_match('/[\r\n\0]/', $v)) {
        respond(false, $M['invalid_input'], 400);
    }
}

// Neviditelné znaky v jednořádkových polích pryč: BIDI přepínače (U+202E) obracejí
// předmět v Martinově schránce, U+2028 v něm dělá zlom řádku, nula-šířkové znaky
// maskují text. Ve zprávě jen řídicí znaky kromě \n a \t (NUL shodí mail() na ValueError).
$stripLine = static fn(string $s): string => trim((string) preg_replace('/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]+/u', '', $s));
$name  = $stripLine($name);
$phone = $stripLine($phone);
// Textarea posílá CRLF; tělo se staví s "\n". Sjednotit hned, ať mb_strlen
// nepočítá každý řádek o znak víc než prohlížeč a v těle nejsou smíšené konce.
$message = str_replace(["\r\n", "\r"], "\n", $message);
$message = trim((string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\x{80}-\x{9F}]/u', '', $message));

if ($name === '' || mb_strlen($name) > MAX_NAME) {
    respond(false, $M['name_required'], 422);
}
if ($email === '' || mb_strlen($email) > MAX_EMAIL || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, $M['email_invalid'], 422);
}
if (mb_strlen($phone) > MAX_PHONE) {
    respond(false, $M['phone_long'], 422);
}
if ($message !== '' && mb_strlen($message) > MAX_MESSAGE) {
    respond(false, $M['message_long'], 422);
}
if (!$gdpr) {
    respond(false, $M['gdpr_required'], 422);
}

// --- 7) Sestavení e-mailu --------------------------------------------------
$subjectName = mb_strlen($name) > SUBJECT_NAME_CHARS
    ? mb_substr($name, 0, SUBJECT_NAME_CHARS - 1) . '…'
    : $name;
$subjectText = ($isProd ? '' : '[TEST – staging] ') . 'Poptávka z webu: ' . $subjectName;
$subject     = encode_header_utf8($subjectText);

$body  = $isProd
    ? "Nová zpráva z kontaktního formuláře na zlatnik-martin.cz\n"
    : "TESTOVACÍ ZPRÁVA ZE STAGINGU – nejde o skutečnou poptávku.\n\n"
      . "Odesláno z: {$host}\n";
$body .= str_repeat('-', 60) . "\n\n";
$body .= "Jméno:    {$name}\n";
$body .= "E-mail:   {$email}\n";
if ($phone !== '') {
    $body .= "Telefon:  {$phone}\n";
}
$body .= "\nZpráva:\n";
$body .= ($message !== '' ? $message : '(bez textu zprávy)') . "\n\n";
$body .= str_repeat('-', 60) . "\n";
$body .= "Web:      {$host}\n";
$body .= 'Čas:      ' . date('j. n. Y H:i (T)') . "\n"; // např. 11. 9. 2026 14:03 (CEST)

// Quoted-printable: jeden odstavec bez Enteru delší než 998 B (≈ 900 znaků češtiny)
// by jinak porušil RFC 5322 §2.1.1 — Exim ≥ 4.95 takovou zprávu vrátí jako bounce
// (do nečtené obálkové adresy = tichá ztráta poptávky), Postfix ji zlomí uprostřed
// slova. Kodér PHP dělá měkké zlomy "=\r\n" nejpozději na 76. znaku a klient je
// při zobrazení spojí. Tvrdý zlom bere kodér JEN z CRLF (holé LF by zakódoval =0A).
$bodyQp = quoted_printable_encode(str_replace("\n", "\r\n", $body));
// Řádek tvořený jen tečkou (konec DATA v SMTP) — pojistka pro sendmail bez -i.
$bodyQp = (string) preg_replace('/^\.(?=\r\n)/m', '=2E', $bodyQp);
if ($nl === "\n") {
    $bodyQp = str_replace("\r\n", "\n", $bodyQp); // jen když PHP samo píše LF
}

$fromHeader = '=?UTF-8?B?' . base64_encode(SENDER_NAME) . '?= <' . SENDER_FROM . '>';

$headers  = "From: {$fromHeader}{$nl}";
$headers .= "Reply-To: {$email}{$nl}";
$headers .= "X-Mailer: zlatnik-martin.cz form{$nl}";
$headers .= "MIME-Version: 1.0{$nl}";
$headers .= "Content-Type: text/plain; charset=UTF-8{$nl}";
$headers .= "Content-Transfer-Encoding: quoted-printable{$nl}";

// --- 8) Atomické razítko rate-limitu (těsně před mail()) -------------------
// Kontrola v kroku 4 a razítko až za mail() nebyly atomické: paralelní dávka
// z jedné IP prošla celá. Pod flock projde z dávky jen první. Při selhání mail()
// se razítko zase smaže, aby opravný pokus nedostal 429.
$fh = @fopen($rateFile, 'c+');
if ($fh !== false && flock($fh, LOCK_EX)) {
    $last = (int) trim((string) stream_get_contents($fh));
    if (time() - $last < RATE_LIMIT_SEC) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(false, $M['rate_limit'], 429);
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, (string) time());
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
}

// --- 9) Odeslání -----------------------------------------------------------
error_clear_last(); // jinak by error_get_last() níž vrátil starý warning
$sent = ENVELOPE_FROM !== ''
    ? @mail(RECIPIENT, $subject, $bodyQp, $headers, '-f' . ENVELOPE_FROM)
    : @mail(RECIPIENT, $subject, $bodyQp, $headers);
$err = $sent ? null : (error_get_last()['message'] ?? 'mail() vrátilo false bez detailu');

form_log($sent ? 'odeslano' : 'chyba', [
    'host' => $host, 'name' => $name, 'email' => $email,
    'phone' => $phone, 'message' => $message,
] + ($err !== null ? ['err' => $err] : []));

if (!$sent) {
    @unlink($rateFile); // neúspěch nesmí blokovat opravný pokus
    respond(false, sprintf($M['send_failed'], RECIPIENT), 500);
}

// Úklid starých zámků (1 % požadavků).
if (random_int(1, 100) === 1) {
    foreach (glob($rateDir . '/zm_form_*.lock') ?: [] as $f) {
        if (filemtime($f) < time() - 86400) {
            @unlink($f);
        }
    }
}

respond(true, $M['success']);
