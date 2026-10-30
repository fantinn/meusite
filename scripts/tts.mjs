// Gera a narração de um reel com a ElevenLabs: uma fala por cena em marca/audio/<nome>-N.mp3.
// As falas vêm da lista VOICE do próprio gerador (marca/reel-<nome>.html), então o texto fica num lugar só.
// Precisa de ELEVENLABS_API_KEY no .env (raiz do projeto). ELEVENLABS_VOICE_ID é opcional.
// Uso: node scripts/tts.mjs 6x1   → depois abra marca/reel-6x1.html e exporte o MP4.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const env = existsSync(join(root, '.env'))
  ? Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => /^\s*[A-Z_]+\s*=/.test(l)).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }))
  : {}
const KEY = process.env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb'
if (!KEY) { console.error('Falta ELEVENLABS_API_KEY no .env do meusite.'); process.exit(1) }

const name = process.argv[2]
const html = name && join(root, 'marca', `reel-${name}.html`)
if (!html || !existsSync(html)) { console.error('Uso: node scripts/tts.mjs <nome>  (ex.: 6x1, loja, sites)'); process.exit(1) }

// Linhas no formato  [cena, atraso, 'texto'],  dentro de  const VOICE = [ ... ]
const block = readFileSync(html, 'utf8').match(/const VOICE = \[([\s\S]*?)\n\]/)
const LINES = block ? [...block[1].matchAll(/\[\s*\d+\s*,\s*[\d.]+\s*,\s*'([^']+)'\s*\]/g)].map((m) => m[1]) : []
if (!LINES.length) { console.error(`Nenhuma fala em VOICE de ${html}`); process.exit(1) }

const out = join(root, 'marca', 'audio')
mkdirSync(out, { recursive: true })
for (const [i, text] of LINES.entries()) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      language_code: 'pt',
      // contexto entre as falas para a entonação seguir como uma narração só
      previous_text: LINES[i - 1],
      next_text: LINES[i + 1],
      voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.08 },
    }),
  })
  if (!res.ok) { console.error(`Fala ${i + 1}: ${res.status} ${await res.text()}`); process.exit(1) }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(join(out, `${name}-${i + 1}.mp3`), buf)
  console.log(`ok ${name}-${i + 1}.mp3  ~${(buf.length / 16000).toFixed(1)}s  "${text}"`)
}
