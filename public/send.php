<?php
declare(strict_types=1);

// ============================================================================
// Contact form handler — zlatnik-martin.cz (Hostinger / LiteSpeed / PHP 8+)
//   POST → odešle e-mail na RECIPIENT a vrátí JSON.
//   Bezpečnost: Origin/Referer check, honeypot, rate-limit, header-injection guard.
// ============================================================================

const RECIPIENT      = 'zlatnikmartin@email.cz';
const SENDER_FROM    = 'formular@zlatnik-martin.cz'; // viz POZNÁMKA v CLAUDE.md — musí existovat na doméně
const SENDER_NAME    = 'Web zlatnik-martin.cz';
const ALLOWED_ORIGIN = 'https://www.zlatnik-martin.cz';
const RATE_LIMIT_SEC = 30;
const MAX_NAME       = 120;
const MAX_EMAIL      = 200;
const MAX_PHONE      = 40;
const MAX_MESSAGE    = 5000;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(bool $ok, string $msg, int $code = 200): never {
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
$valid = (str_starts_with($origin,  ALLOWED_ORIGIN))
      || (str_starts_with($referer, ALLOWED_ORIGIN));
if (!$valid) {
    respond(false, 'Neplatný původ požadavku.', 403);
}

// --- 3) Honeypot — tichý úspěch pro boty -----------------------------------
if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond(true, 'Děkuji, zpráva byla odeslána.');
}

// --- 4) Rate-limit (file-based, per IP) ------------------------------------
$ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateFile = sys_get_temp_dir() . '/zm_form_' . md5($ip) . '.lock';
if (file_exists($rateFile) && (time() - filemtime($rateFile)) < RATE_LIMIT_SEC) {
    respond(false, 'Zpráva byla nedávno odeslána. Zkuste to prosím za chvíli.', 429);
}
@touch($rateFile);

// --- 5) Validace -----------------------------------------------------------
$name    = trim((string)($_POST['name']    ?? ''));
$email   = trim((string)($_POST['email']   ?? ''));
$phone   = trim((string)($_POST['phone']   ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$gdpr    = isset($_POST['gdpr']);

if ($name === '' || mb_strlen($name) > MAX_NAME) {
    respond(false, 'Vyplňte prosím své jméno.', 422);
}
if ($email === '' || mb_strlen($email) > MAX_EMAIL || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Zadejte platnou e-mailovou adresu.', 422);
}
if (mb_strlen($phone) > MAX_PHONE) {
    respond(false, 'Telefonní číslo je příliš dlouhé.', 422);
}
if ($message !== '' && mb_strlen($message) > MAX_MESSAGE) {
    respond(false, 'Zpráva je příliš dlouhá.', 422);
}
if (!$gdpr) {
    respond(false, 'Pro odeslání je nutné odsouhlasit zpracování osobních údajů.', 422);
}

// --- 6) Header-injection guard (CR/LF v polích jdoucích do hlaviček) -------
foreach ([$name, $email, $phone] as $v) {
    if (preg_match('/[\r\n]/', $v)) {
        respond(false, 'Neplatný formát vstupu.', 400);
    }
}

// --- 7) Sestavení e-mailu --------------------------------------------------
$subject = '=?UTF-8?B?' . base64_encode('Poptávka z webu — ' . $name) . '?=';

$body  = "Nová zpráva z kontaktního formuláře na zlatnik-martin.cz\n";
$body .= str_repeat('-', 60) . "\n\n";
$body .= "Jméno:    {$name}\n";
$body .= "E-mail:   {$email}\n";
if ($phone !== '') {
    $body .= "Telefon:  {$phone}\n";
}
$body .= "\nZpráva:\n";
$body .= ($message !== '' ? $message : '(bez textu zprávy)') . "\n\n";
$body .= str_repeat('-', 60) . "\n";
$body .= "IP:       {$ip}\n";
$body .= "Čas:      " . date('Y-m-d H:i:s') . "\n";

$fromHeader = '=?UTF-8?B?' . base64_encode(SENDER_NAME) . '?= <' . SENDER_FROM . '>';

$headers  = "From: {$fromHeader}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: zlatnik-martin.cz form\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = @mail(RECIPIENT, $subject, $body, $headers);

if (!$sent) {
    respond(false, 'Zprávu se nepodařilo odeslat. Napište prosím přímo na ' . RECIPIENT . '.', 500);
}

respond(true, 'Děkuji, ozvu se vám co nejdříve.');
