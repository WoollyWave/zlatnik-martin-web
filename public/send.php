<?php
declare(strict_types=1);

// ============================================================================
// Contact form handler — zlatnik-martin.cz (Hostinger / LiteSpeed / PHP 8.1+,
// vyžaduje `never` return type; na 8.0 by soubor skončil parse errorem)
//   POST → odešle e-mail na RECIPIENT a vrátí JSON.
//   Bezpečnost: Origin/Referer check, honeypot, rate-limit, header-injection guard.
//   Hlášky lokalizované podle skrytého pole `locale` (cs/en) z formuláře.
// ============================================================================

const RECIPIENT      = 'zlatnikmartin@email.cz';
const SENDER_FROM    = 'formular@zlatnik-martin.cz'; // viz POZNÁMKA v CLAUDE.md — musí existovat na doméně
const SENDER_NAME    = 'Web zlatnik-martin.cz';
// Produkce + staging (stejný build běží na obou). Prohlížeč Origin nezfalšuje,
// honeypot + rate-limit platí vždy.
const ALLOWED_ORIGINS = [
    'https://www.zlatnik-martin.cz',
    'https://web.vilim.sbs',
];
const RATE_LIMIT_SEC = 30;
const MAX_NAME       = 120;
const MAX_EMAIL      = 200;
const MAX_PHONE      = 40;
const MAX_MESSAGE    = 5000;

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

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
        'success'        => 'Děkuji, ozvu se vám co nejdříve.',
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
        'success'        => 'Thank you, I will get back to you as soon as possible.',
    ],
];
$M = $MESSAGES[$locale];

function respond(bool $ok, string $msg, int $code = 200): never {
    global $wantsJson, $formPage;
    if (!$wantsJson) {
        // 303 See Other → zpět na stránku formuláře; fragment zobrazí statickou
        // hlášku přes CSS :target (viz ContactForm.astro), žádný JS není potřeba.
        http_response_code(303);
        header('Location: ' . $formPage . ($ok ? '#form-sent' : '#form-error'));
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
if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond(true, $M['sent']);
}

// --- 4) Rate-limit (file-based, per IP) ------------------------------------
$ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rateFile = sys_get_temp_dir() . '/zm_form_' . md5($ip) . '.lock';
if (file_exists($rateFile) && (time() - filemtime($rateFile)) < RATE_LIMIT_SEC) {
    respond(false, $M['rate_limit'], 429);
}
// POZOR: `touch()` schválně AŽ za úspěšným mail() (konec souboru), ne tady.
// Když se orazítkuje před validací, zákazník s překlepem v e-mailu dostane 422
// a jeho oprava do 30 s narazí na 429 — ztracená poptávka. Boty odfiltruje
// Origin check a honeypot výš, ty běží dřív.

// --- 5) Validace -----------------------------------------------------------
$name    = trim((string)($_POST['name']    ?? ''));
$email   = trim((string)($_POST['email']   ?? ''));
$phone   = trim((string)($_POST['phone']   ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$gdpr    = isset($_POST['gdpr']);

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

// --- 6) Header-injection guard (CR/LF v polích jdoucích do hlaviček) -------
foreach ([$name, $email, $phone] as $v) {
    if (preg_match('/[\r\n]/', $v)) {
        respond(false, $M['invalid_input'], 400);
    }
}

// --- 7) Sestavení e-mailu --------------------------------------------------
$subjectText = ($isProd ? '' : '[TEST – staging] ') . 'Poptávka z webu: ' . $name;
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

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
$body .= "IP:       {$ip}\n";
$body .= "Web:      {$host}\n";
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
    respond(false, sprintf($M['send_failed'], RECIPIENT), 500);
}

// Rate-limit orazítkovat až tady — počítá se jen skutečně odeslaná zpráva.
@touch($rateFile);

respond(true, $M['success']);
