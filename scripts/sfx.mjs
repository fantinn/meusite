// Gera efeitos sonoros com a ElevenLabs a partir de marca/narracao/<nome>.json → sfx: { id: { prompt, seconds, loop? } }.
// Salva marca/narracao/<nome>/sfx-<id>.mp3. Pular os que já existem; passe ids separados por vírgula para refazer.
// Uso: node --env-file=.env.local scripts/sfx.mjs 6x1-loja [pop,tick]
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { readFileSync, mkdirSync, createWriteStream, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const name = process.argv[2]
if (!name) { console.error('Uso: node --env-file=.env.local scripts/sfx.mjs <nome do roteiro> [ids]'); process.exit(1) }
const { sfx } = JSON.parse(readFileSync(join(root, 'marca', 'narracao', `${name}.json`), 'utf8'))
const out = join(root, 'marca', 'narracao', name)
mkdirSync(out, { recursive: true })
const redo = process.argv[3] ? new Set(process.argv[3].split(',')) : null

const client = new ElevenLabsClient() // lê ELEVENLABS_API_KEY do ambiente
for (const [id, { prompt, seconds, loop = false }] of Object.entries(sfx)) {
  const file = join(out, `sfx-${id}.mp3`)
  if (redo ? !redo.has(id) : existsSync(file)) continue
  const audio = await client.textToSoundEffects.convert({ text: prompt, durationSeconds: seconds, promptInfluence: 0.7, loop })
  await finished((typeof audio.pipe === 'function' ? audio : Readable.fromWeb(audio)).pipe(createWriteStream(file)))
  console.log(`ok sfx-${id}.mp3  "${prompt}"`)
}
