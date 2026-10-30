// Narra um vídeo pronto com a ElevenLabs (Eleven v4).
// O roteiro fica em marca/narracao/<nome>.json: { video, voiceId, duration, lines: [{ at, text }] }, com `at` = segundo em que a legenda da fala aparece.
// O texto todo é lido numa leitura só (a entonação acompanha o sentido do roteiro inteiro) e depois
// transcrito com o Scribe para saber onde cada palavra cai; a mixagem usa isso para cortar a leitura por fala
// e encaixar cada uma na sua legenda.
// Gera marca/narracao/<nome>/take.mp3 e take-words.json.
// Uso: node --env-file=.env.local scripts/narrar.mjs 6x1-loja
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { readFileSync, writeFileSync, mkdirSync, createWriteStream } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const name = process.argv[2]
if (!name) { console.error('Uso: node --env-file=.env.local scripts/narrar.mjs <nome do roteiro>'); process.exit(1) }
const script = JSON.parse(readFileSync(join(root, 'marca', 'narracao', `${name}.json`), 'utf8'))
const out = join(root, 'marca', 'narracao', name)
mkdirSync(out, { recursive: true })

const client = new ElevenLabsClient() // lê ELEVENLABS_API_KEY do ambiente
const take = join(out, 'take.mp3')
const audio = await client.textToSpeech.convert(script.voiceId, {
  text: script.lines.map((l) => l.text).join('\n'),
  modelId: 'eleven_v4',
  languageCode: 'pt',
  // estabilidade média: varia o tom com o sentido do texto sem sair do personagem
  voiceSettings: { stability: 0.5, similarityBoost: 0.8 },
})
await finished(Readable.fromWeb(audio).pipe(createWriteStream(take)))
console.log(`ok ${take}`)

const stt = await client.speechToText.convert({
  file: new Blob([readFileSync(take)], { type: 'audio/mpeg' }),
  modelId: 'scribe_v2',
  languageCode: 'por',
  timestampsGranularity: 'word',
})
const words = stt.words.filter((w) => w.type === 'word').map(({ text, start, end }) => ({ text, start, end }))
writeFileSync(join(out, 'take-words.json'), JSON.stringify(words, null, 1))
console.log(`ok take-words.json (${words.length} palavras)\n${stt.text}`)
