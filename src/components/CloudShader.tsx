import { useEffect, useRef } from 'react'

// Céu com nuvens soltas no fundo do hero (shader do Cloud Shader da Aceternity UI, adaptado):
// WebGL puro, sem bibliotecas. Nuvens em camadas atravessando o céu.
// - Céu de dia no modo claro e céu noturno no escuro (troca junto com o tema)
// - Em telas em pé (celular) as nuvens encolhem para não ficarem gigantes e esticadas
// - Pausa quando sai da tela e respeita "reduzir movimento" do sistema
const SKIES = {
  light: { cloud: [0.98, 0.98, 0.99], top: [0.2, 0.46, 0.76], bottom: [0.58, 0.78, 0.94], sun: 0.28 },
  dark: { cloud: [0.55, 0.64, 0.78], top: [0.02, 0.07, 0.17], bottom: [0.09, 0.2, 0.36], sun: 0.06 },
}

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform float u_size;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;
uniform float u_sun;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367); }

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) { sum += amp * vnoise(p); p = R * p * 2.03 + 19.19; amp *= 0.5; }
  return sum;
}

// ruído "billow": cristas fofas, como o topo de uma nuvem
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) { sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0)); p = R * p * 2.11 + 13.37; amp *= 0.5; }
  return sum;
}

// densidade de uma nuvem: cúpula em cima, base reta embaixo, preenchida com ruído
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(fbm(dp * 1.4 + t * 0.04), fbm(dp * 1.4 + 7.7 - t * 0.03));
  float detail = billow(dp * 1.6);
  return env + (detail - 0.62) * 0.62;
}

vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;
  // amostra acima do ponto para simular a sombra da própria nuvem
  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);
  vec3 lit = u_cloud * 1.04;
  vec3 shadow = mix(u_cloud * 0.60, sky, 0.38);
  vec3 cloudCol = mix(lit, shadow, occl * 0.85);
  float alpha = smoothstep(0.02, 0.38, d);
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += rim * 0.10;
  // nuvens distantes se misturam ao céu
  cloudCol = mix(cloudCol, sky, dist * 0.35);
  alpha *= mix(1.0, 0.8, dist);
  return mix(color, cloudCol, alpha);
}

vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t, float spd, float phase, float y, vec2 r, float seed, float dist) {
  r *= u_size;
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd / u_size + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time;
  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 color = sky;
  color = mix(color, u_skyBottom * 1.06, smoothstep(0.35, 0.0, v_uv.y) * 0.5);
  // brilho suave do sol, no alto à direita
  vec2 sunPos = vec2(aspect * 0.78, 0.92);
  float sunDist = length(p - sunPos);
  color += vec3(0.92, 0.96, 1.0) * exp(-sunDist * sunDist * 5.0) * u_sun;
  // fiapos de nuvem bem no alto
  float cirrusBand = smoothstep(0.55, 0.8, v_uv.y) * (1.0 - smoothstep(0.9, 1.0, v_uv.y));
  if (cirrusBand > 0.01) {
    float streak = fbm(vec2(p.x * 1.6 / u_size - t * 0.006, p.y * 12.0));
    float wisp = smoothstep(0.52, 0.78, streak) * cirrusBand;
    color = mix(color, u_cloud * 0.98, wisp * 0.35);
  }
  // do fundo (pequenas, altas, lentas) para a frente (grandes, baixas, rápidas)
  color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);
  gl_FragColor = vec4(color, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function CloudShader({ speed = 1.6 }: { speed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return
    const vert = compile(gl, gl.VERTEX_SHADER, VERT)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const program = gl.createProgram()
    if (!vert || !frag || !program) return
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.bindAttribLocation(program, 0, 'a_pos')
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    // Um triângulo que cobre a tela toda.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const loc = {
      res: gl.getUniformLocation(program, 'u_res'),
      time: gl.getUniformLocation(program, 'u_time'),
      size: gl.getUniformLocation(program, 'u_size'),
      cloud: gl.getUniformLocation(program, 'u_cloud'),
      top: gl.getUniformLocation(program, 'u_skyTop'),
      bottom: gl.getUniformLocation(program, 'u_skyBottom'),
      sun: gl.getUniformLocation(program, 'u_sun'),
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let visible = false
    let t = 40 // começa "adiantado" para as nuvens já estarem espalhadas pelo céu
    let last = performance.now()

    const resize = () => {
      // Resolução um pouco reduzida: as nuvens são suaves e assim o shader roda leve até no celular.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(loc.res, w, h)
      // Tela em pé: nuvens menores (proporcionais à largura), senão uma só ocupa a tela inteira.
      gl.uniform1f(loc.size, Math.min(1, Math.max(0.35, w / h / 1.4)))
    }

    const draw = () => {
      const sky = document.documentElement.dataset.theme === 'dark' ? SKIES.dark : SKIES.light
      gl.uniform1f(loc.time, t)
      gl.uniform3f(loc.cloud, sky.cloud[0], sky.cloud[1], sky.cloud[2])
      gl.uniform3f(loc.top, sky.top[0], sky.top[1], sky.top[2])
      gl.uniform3f(loc.bottom, sky.bottom[0], sky.bottom[1], sky.bottom[2])
      gl.uniform1f(loc.sun, sky.sun)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      t += Math.min((now - last) / 1000, 0.1) * speed
      last = now
      draw()
      if (visible) raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => { resize(); draw() })
    ro.observe(canvas)
    resize()
    draw()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(canvas)

    // Redesenha na hora quando o tema muda (inclusive com movimento reduzido).
    const mo = new MutationObserver(draw)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
    }
  }, [speed])

  return (
    <div className="sky-bg" aria-hidden>
      <canvas ref={ref} className="sky-bg__canvas" />
    </div>
  )
}
