import type { EditorState } from '../types'
import type { Preset } from '../presets'

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = Number.parseInt(full, 16)
  if (Number.isNaN(n)) return { r: 0, g: 0, b: 0 }
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

const grainCache = new Map<string, HTMLCanvasElement>()

function getGrainPattern(w: number, h: number) {
  const key = `${w}x${h}`
  const cached = grainCache.get(key)
  if (cached) return cached

  const c = document.createElement('canvas')
  // Lower-res tile for speed
  const tw = Math.min(320, w)
  const th = Math.min(180, h)
  c.width = tw
  c.height = th
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(tw, th)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  grainCache.set(key, c)
  return c
}

export function paintVignette(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  amount: number,
) {
  if (amount <= 0) return
  const grad = ctx.createRadialGradient(
    preset.width / 2,
    preset.height / 2,
    Math.min(preset.width, preset.height) * 0.25,
    preset.width / 2,
    preset.height / 2,
    Math.hypot(preset.width, preset.height) * 0.55,
  )
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, `rgba(0,0,0,${amount})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, preset.width, preset.height)
}

export function paintGrain(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  amount: number,
) {
  if (amount <= 0) return
  const tile = getGrainPattern(preset.width, preset.height)
  ctx.save()
  ctx.globalAlpha = amount * 0.35
  ctx.globalCompositeOperation = 'overlay'
  const pattern = ctx.createPattern(tile, 'repeat')
  if (pattern) {
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, preset.width, preset.height)
  }
  ctx.restore()
}

export function paintScanlines(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  amount: number,
) {
  if (amount <= 0) return
  ctx.save()
  ctx.globalAlpha = amount * 0.35
  ctx.fillStyle = '#000'
  const step = Math.max(3, Math.round(preset.height / 180))
  for (let y = 0; y < preset.height; y += step) {
    ctx.fillRect(0, y, preset.width, 1)
  }
  ctx.restore()
}

export function paintGlow(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  if (state.glow <= 0) return
  const { r, g, b } = hexToRgb(state.glowColor)
  const x = (state.glowX / 100) * preset.width
  const y = (state.glowY / 100) * preset.height
  const radius = Math.hypot(preset.width, preset.height) * 0.55
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
  grad.addColorStop(0, `rgba(${r},${g},${b},${state.glow * 0.7})`)
  grad.addColorStop(0.45, `rgba(${r},${g},${b},${state.glow * 0.25})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, preset.width, preset.height)
  ctx.restore()
}

export function paintSpotlight(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  if (state.spotlight <= 0) return
  const x = (state.spotlightX / 100) * preset.width
  const y = (state.spotlightY / 100) * preset.height
  const radius =
    Math.hypot(preset.width, preset.height) * (state.spotlightSize / 100)
  const grad = ctx.createRadialGradient(x, y, radius * 0.15, x, y, radius)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.55, `rgba(0,0,0,${state.spotlight * 0.35})`)
  grad.addColorStop(1, `rgba(0,0,0,${state.spotlight * 0.85})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, preset.width, preset.height)
}

export function paintLetterbox(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  amount: number,
) {
  if (amount <= 0) return
  const h = preset.height * amount
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, preset.width, h)
  ctx.fillRect(0, preset.height - h, preset.width, h)
}

export function paintStripes(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  if (state.stripes <= 0) return
  const { r, g, b } = hexToRgb(state.stripeColor)
  ctx.save()
  ctx.translate(preset.width / 2, preset.height / 2)
  ctx.rotate((state.stripeAngle * Math.PI) / 180)
  ctx.globalAlpha = state.stripes * 0.35
  ctx.fillStyle = `rgb(${r},${g},${b})`
  const diag = Math.hypot(preset.width, preset.height)
  const gap = Math.max(8, state.stripeGap)
  const band = gap * 0.45
  for (let x = -diag; x < diag; x += gap) {
    ctx.fillRect(x, -diag, band, diag * 2)
  }
  ctx.restore()
}

export function paintFrame(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  if (!state.frameEnabled) return
  const inset = state.frameInset
  const w = state.frameWidth
  ctx.save()
  ctx.strokeStyle = state.frameColor
  ctx.lineWidth = w
  if (state.roundedCorners > 0) {
    const r = state.roundedCorners
    ctx.beginPath()
    ctx.roundRect(
      inset + w / 2,
      inset + w / 2,
      preset.width - inset * 2 - w,
      preset.height - inset * 2 - w,
      Math.max(0, r - inset),
    )
    ctx.stroke()
  } else {
    ctx.strokeRect(
      inset + w / 2,
      inset + w / 2,
      preset.width - inset * 2 - w,
      preset.height - inset * 2 - w,
    )
  }
  ctx.restore()
}

/** Color grade via canvas filter redraw. */
export function applyColorGrade(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  const needsGrade =
    state.brightness !== 100 ||
    state.contrast !== 100 ||
    state.saturate !== 100 ||
    state.hueRotate !== 0 ||
    state.invert

  if (!needsGrade) return

  const temp = document.createElement('canvas')
  temp.width = preset.width
  temp.height = preset.height
  const tctx = temp.getContext('2d')!
  tctx.drawImage(ctx.canvas, 0, 0)

  const filters = [
    `brightness(${state.brightness}%)`,
    `contrast(${state.contrast}%)`,
    `saturate(${state.saturate}%)`,
    state.hueRotate ? `hue-rotate(${state.hueRotate}deg)` : '',
    state.invert ? 'invert(1)' : '',
  ]
    .filter(Boolean)
    .join(' ')

  ctx.save()
  ctx.filter = filters
  ctx.clearRect(0, 0, preset.width, preset.height)
  ctx.drawImage(temp, 0, 0)
  ctx.restore()
}

export function applyRoundedCorners(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  radius: number,
) {
  if (radius <= 0) return
  const temp = document.createElement('canvas')
  temp.width = preset.width
  temp.height = preset.height
  const tctx = temp.getContext('2d')!
  tctx.drawImage(ctx.canvas, 0, 0)

  ctx.clearRect(0, 0, preset.width, preset.height)
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(0, 0, preset.width, preset.height, radius)
  ctx.clip()
  ctx.drawImage(temp, 0, 0)
  ctx.restore()
}

export function applyAllEffects(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  applyColorGrade(ctx, preset, state)
  paintGlow(ctx, preset, state)
  paintSpotlight(ctx, preset, state)
  paintVignette(ctx, preset, state.vignette)
  paintStripes(ctx, preset, state)
  paintScanlines(ctx, preset, state.scanlines)
  paintGrain(ctx, preset, state.grain)
  paintLetterbox(ctx, preset, state.letterbox)
  paintFrame(ctx, preset, state)
  applyRoundedCorners(ctx, preset, state.roundedCorners)
}
