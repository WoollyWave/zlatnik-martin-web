#!/usr/bin/env node
// Oznámení produkčního nasazení do Signal Loop (push deploy.v1). Spustit hned po nahrání do public_html:
//   node scripts/oznam-nasazeni.mjs                       → teď, HEAD a předmět posledního commitu
//   node scripts/oznam-nasazeni.mjs --summary "…"         → vlastní shrnutí (nejvýš 200 znaků)
//   node scripts/oznam-nasazeni.mjs --at 2026-09-10T14:20:54Z --commit <sha> --summary "…"   → zpětný zápis
// Tajemství: ~/.config/signal-loop/deploy-zlatnik.secret (0600, mimo repo); klíčem HMAC je jeho obsah.
// Selhání oznámení nasazení nerozbije: jen vypíše chybu a skončí kódem 1.
import { createHmac } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { parseArgs } from 'node:util'

const ENDPOINT = 'https://app.vilim.sbs/api/v1/push/deploy/01a10bd1-a776-7246-8e57-61ff612d7318'
const SECRET_FILE = `${homedir()}/.config/signal-loop/deploy-zlatnik.secret`
const RETRIES = [0, 5000, 30000]

const { values } = parseArgs({
  options: { at: { type: 'string' }, commit: { type: 'string' }, summary: { type: 'string' } },
})
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

if (!values.at && git('status', '--porcelain', '--untracked-files=no') !== '') {
  console.warn('pozor: necommitnuté změny, nasazený stav nemusí odpovídat commitu (pořadí commit → build → upload)')
}

const payload = {
  schema_version: 1,
  site: 'zlatnik',
  environment: 'production',
  deployed_at: values.at ?? new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  tool: 'other', // ZIP přes hPanel File Manager
  ref: 'main',
  commit: values.commit ?? git('rev-parse', 'HEAD'),
  // po znacích, ne po jednotkách UTF-16: rozpůlené emoji by Postgres odmítl a server vrátil 500
  summary: Array.from(values.summary ?? git('log', '-1', '--pretty=%s')).slice(0, 200).join(''),
}
if (!values.at) {
  const actor = git('config', 'user.email')
  if (actor) payload.actor = actor // server ukládá jen otisk, e-mail ne
}

const secret = readFileSync(SECRET_FILE, 'utf8').trim()
const body = JSON.stringify(payload)
let status = 0
let answer = ''
for (const wait of RETRIES) {
  if (wait) await new Promise((r) => setTimeout(r, wait))
  const ts = String(Math.floor(Date.now() / 1000))
  const sig = createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Timestamp': ts, 'X-Webhook-Signature': `v1=${sig}` },
    })
    status = res.status
    answer = await res.text()
  } catch (err) {
    status = 0
    answer = String(err?.cause?.code ?? err)
  }
  if (status === 202 || status === 409 || (status >= 400 && status < 500 && status !== 429)) break
}
console.log(`nasazení ${payload.deployed_at} ${payload.commit.slice(0, 7)}: HTTP ${status} ${answer}`)
process.exit(status === 202 || status === 409 ? 0 : 1)
