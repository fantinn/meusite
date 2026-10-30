// Mixa a narração (scripts/narrar.mjs) e os efeitos (scripts/sfx.mjs) no vídeo do roteiro: corta a leitura por fala,
// encaixa cada fala na sua legenda com pausa entre elas, põe os efeitos nos tempos de `cues` bem abaixo da voz
// e troca o áudio original. Saída em -14 LUFS (volume de Reels).
// Uso: node scripts/mixar.mjs 6x1-loja saida.mp4 [volume dos efeitos, padrão 0.16]
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import FF from 'ffmpeg-static'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const [name, outPath, sfxLevel = '0.16'] = process.argv.slice(2)
if (!outPath) { console.error('Uso: node scripts/mixar.mjs <nome do roteiro> <saida.mp4> [volume dos efeitos]'); process.exit(1) }
const jsonPath = join(root, 'marca', 'narracao', `${name}.json`), dir = join(root, 'marca', 'narracao', name)
const s = JSON.parse(readFileSync(jsonPath, 'utf8'))
const words = JSON.parse(readFileSync(join(dir, 'take-words.json'), 'utf8'))
const tmp = join(tmpdir(), `narracao-${name}`); mkdirSync(tmp, { recursive: true })

// quantas palavras cada fala tem (mesma contagem do Scribe: hífen junta, pontuação some)
const count = (t) => t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
let k = 0
const spans = s.lines.map((l) => { const a = k; k += count(l.text); return [a, k - 1] })
if (k !== words.length) { console.error(`contagem não bate: roteiro ${k} x take ${words.length}`); process.exit(1) }

let prevEnd = 0
const voice = spans.map(([a, b], i) => {
  const w0 = words[a], w1 = words[b]
  const cutIn = Math.max(words[a - 1]?.end ?? 0, w0.start - 0.06)
  const cutOut = Math.min(words[b + 1]?.start ?? w1.end + 0.4, w1.end + 0.15)
  const d = cutOut - cutIn, at = s.lines[i].at
  const next = s.lines[i + 1]?.at ?? s.duration - 0.3
  const start = Math.max(at, prevEnd + 0.22) // pausa mínima entre falas
  const tempo = Math.min(1.15, Math.max(1, d / (next + 0.1 - start)))
  prevEnd = start + d / tempo
  console.log(`${i + 1}\tcaption ${at}\tstart ${start.toFixed(2)}\tlen ${d.toFixed(2)}\ttempo ${tempo.toFixed(2)}\t"${words[a].text} … ${words[b].text}"`)
  const f = join(tmp, `${i + 1}.wav`)
  execFileSync(FF, ['-v', 'error', '-y', '-i', join(dir, 'take.mp3'), '-af', `atrim=${cutIn.toFixed(3)}:${cutOut.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=${(d - 0.04).toFixed(3)}:d=0.04,atempo=${tempo.toFixed(3)}`, '-ar', '48000', '-ac', '2', f])
  return { f, start }
})

const inputs = ['-i', s.video], parts = []
voice.forEach((v, i) => { inputs.push('-i', v.f); parts.push(`[${i + 1}:a]adelay=${Math.round(v.start * 1000)}|${Math.round(v.start * 1000)}[v${i}]`) })
let n = voice.length + 1
// cue: [id, segundo, volume = 1, fim]; efeitos com loop (trilha) repetem até `fim` (ou o fim do vídeo), com fade
const fx = s.cues.map(([id, t, gain = 1, end = s.duration], j) => {
  const loop = s.sfx[id].loop, len = end - t
  inputs.push(...(loop ? ['-stream_loop', '-1'] : []), '-i', join(dir, `sfx-${id}.mp3`))
  const vol = gain * parseFloat(sfxLevel)
  const trim = loop ? `atrim=0:${len},afade=t=in:d=1.2,afade=t=out:st=${len - 1.5}:d=1.5,` : ''
  parts.push(`[${n++}:a]${trim}aformat=sample_rates=48000:channel_layouts=stereo,volume=${vol.toFixed(3)},adelay=${Math.round(t * 1000)}|${Math.round(t * 1000)}[f${j}]`)
  return `[f${j}]`
})
const fc = [
  ...parts,
  `${voice.map((_, i) => `[v${i}]`).join('')}amix=inputs=${voice.length}:normalize=0,asplit=2[voice][key]`,
  `${fx.join('')}amix=inputs=${fx.length}:normalize=0[fxraw]`,
  `[fxraw][key]sidechaincompress=threshold=0.05:ratio=4:attack=20:release=300[fx]`,
  // volume de Reels: -14 LUFS, pico em -1,5 dB
  `[voice][fx]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]`,
].join(';')
execFileSync(FF, ['-v', 'error', '-y', ...inputs, '-filter_complex', fc, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(s.duration), '-movflags', '+faststart', outPath], { stdio: 'inherit' })
console.log('ok', outPath)
