import { getFont } from '../fonts'
import type { Preset } from '../presets'
import type { EditorState, SelectedTarget, TextLayer } from '../types'
import { applyAllEffects } from './effects'
import { drawShape } from './shapes'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const imageCache = new Map<string, HTMLImageElement>()

async function getImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached?.complete) return cached
  const img = await loadImage(src)
  imageCache.set(src, img)
  return img
}

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

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
  blur: number,
) {
  const scale = Math.max(width / img.width, height / img.height) * zoom
  const w = img.width * scale
  const h = img.height * scale
  const x = (width - w) / 2 + (offsetX / 100) * width
  const y = (height - h) / 2 + (offsetY / 100) * height
  ctx.save()
  if (blur > 0) ctx.filter = `blur(${blur}px)`
  ctx.drawImage(img, x, y, w, h)
  ctx.restore()
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  if (state.useGradient) {
    const rad = (state.gradientAngle * Math.PI) / 180
    const cx = preset.width / 2
    const cy = preset.height / 2
    const len = Math.hypot(preset.width, preset.height) / 2
    const grad = ctx.createLinearGradient(
      cx - Math.cos(rad) * len,
      cy - Math.sin(rad) * len,
      cx + Math.cos(rad) * len,
      cy + Math.sin(rad) * len,
    )
    grad.addColorStop(0, state.backgroundColor)
    grad.addColorStop(1, state.backgroundColor2)
    ctx.fillStyle = grad
  } else {
    ctx.fillStyle = state.backgroundColor
  }
  ctx.fillRect(0, 0, preset.width, preset.height)
}

function prepareText(layer: TextLayer) {
  return layer.uppercase ? layer.text.toUpperCase() : layer.text
}

function fontCss(layer: TextLayer) {
  const font = getFont(layer.font)
  const weight = layer.weight > 0 ? layer.weight : font.weight
  const style = layer.italic ? 'italic' : 'normal'
  return `${style} ${weight} ${layer.size}px ${font.family}`
}

function underlineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  layer: TextLayer,
) {
  if (!layer.underline || !text) return
  const w =
    layer.letterSpacing !== 0
      ? [...text].reduce((sum, ch, i) => {
          return (
            sum +
            ctx.measureText(ch).width +
            (i < text.length - 1 ? layer.letterSpacing : 0)
          )
        }, 0)
      : ctx.measureText(text).width
  let left = x
  if (layer.align === 'center') left = x - w / 2
  if (layer.align === 'right') left = x - w
  const uy = y + layer.size * 0.42
  ctx.strokeStyle = layer.color
  ctx.lineWidth = Math.max(2, layer.size * 0.06)
  ctx.beginPath()
  ctx.moveTo(left, uy)
  ctx.lineTo(left + w, uy)
  ctx.stroke()
}

function paintTextLayer(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  layer: TextLayer,
) {
  const text = prepareText(layer)
  const x = (layer.x / 100) * preset.width
  const y = (layer.y / 100) * preset.height

  ctx.save()
  ctx.globalAlpha = layer.opacity
  ctx.textAlign = layer.align
  ctx.textBaseline = 'middle'
  ctx.translate(x, y)
  if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180)
  ctx.font = fontCss(layer)

  if (layer.letterSpacing !== 0) {
    drawSpacedText(ctx, text, 0, 0, layer)
  } else {
    if (layer.shadow) {
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.55)'
      ctx.shadowBlur = layer.shadowBlur
      ctx.shadowOffsetY = layer.shadowOffsetY
      ctx.fillStyle = layer.color
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
    if (layer.stroke) {
      ctx.strokeStyle = layer.strokeColor
      ctx.lineWidth = layer.strokeWidth
      ctx.lineJoin = 'round'
      ctx.strokeText(text, 0, 0)
    }
    ctx.fillStyle = layer.color
    ctx.fillText(text, 0, 0)
  }

  underlineText(ctx, text, 0, 0, layer)
  ctx.restore()
}

function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  layer: TextLayer,
) {
  const chars = [...text]
  const widths = chars.map((c) => ctx.measureText(c).width)
  const total =
    widths.reduce((a, b) => a + b, 0) +
    Math.max(0, chars.length - 1) * layer.letterSpacing

  let cursor = x
  if (layer.align === 'center') cursor = x - total / 2
  if (layer.align === 'right') cursor = x - total

  const prevAlign = ctx.textAlign
  ctx.textAlign = 'left'

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    if (layer.shadow) {
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.55)'
      ctx.shadowBlur = layer.shadowBlur
      ctx.shadowOffsetY = layer.shadowOffsetY
      ctx.fillStyle = layer.color
      ctx.fillText(ch, cursor, y)
      ctx.restore()
    }
    if (layer.stroke) {
      ctx.strokeStyle = layer.strokeColor
      ctx.lineWidth = layer.strokeWidth
      ctx.lineJoin = 'round'
      ctx.strokeText(ch, cursor, y)
    }
    ctx.fillStyle = layer.color
    ctx.fillText(ch, cursor, y)
    cursor += widths[i] + layer.letterSpacing
  }

  ctx.textAlign = prevAlign
}

function measureTextBox(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  layer: TextLayer,
) {
  const text = prepareText(layer) || ' '
  ctx.font = fontCss(layer)
  let w = ctx.measureText(text).width
  if (layer.letterSpacing !== 0 && text.length > 1) {
    w += (text.length - 1) * layer.letterSpacing
  }
  const h = layer.size * Math.max(1.15, layer.lineHeight || 1.15)
  const x = (layer.x / 100) * preset.width
  const y = (layer.y / 100) * preset.height
  let left = x
  if (layer.align === 'center') left = x - w / 2
  if (layer.align === 'right') left = x - w
  return { left, top: y - h / 2, width: w, height: h, x, y }
}

function paintSelection(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
  selected: SelectedTarget,
) {
  if (!selected) return
  ctx.save()
  ctx.strokeStyle = 'rgba(245, 165, 36, 0.9)'
  ctx.lineWidth = 3
  ctx.setLineDash([12, 8])

  if (selected.type === 'shape') {
    const shape = state.shapes.find((s) => s.id === selected.id)
    if (!shape) {
      ctx.restore()
      return
    }
    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2
    ctx.translate(cx, cy)
    ctx.rotate((shape.rotation * Math.PI) / 180)
    ctx.strokeRect(
      -shape.width / 2 - 6,
      -shape.height / 2 - 6,
      shape.width + 12,
      shape.height + 12,
    )
    ctx.setLineDash([])
    ctx.fillStyle = '#F5A524'
    const size = 14
    for (const corner of [
      [-shape.width / 2 - 6, -shape.height / 2 - 6],
      [shape.width / 2 + 6, -shape.height / 2 - 6],
      [-shape.width / 2 - 6, shape.height / 2 + 6],
      [shape.width / 2 + 6, shape.height / 2 + 6],
    ] as const) {
      ctx.fillRect(corner[0] - size / 2, corner[1] - size / 2, size, size)
    }
  } else {
    const layer = state.texts.find((t) => t.id === selected.id)
    if (!layer) {
      ctx.restore()
      return
    }
    const box = measureTextBox(ctx, preset, layer)
    ctx.translate(box.x, box.y)
    ctx.rotate((layer.rotation * Math.PI) / 180)
    const left = box.left - box.x
    const top = box.top - box.y
    ctx.strokeRect(left - 10, top - 6, box.width + 20, box.height + 12)
  }

  ctx.restore()
}

async function ensureFonts(state: EditorState) {
  if (!document.fonts) return
  await Promise.all([
    ...state.texts.map((t) => document.fonts.load(fontCss(t))),
    document.fonts.ready,
  ])
}

export async function renderToCanvas(
  preset: Preset,
  state: EditorState,
  options: {
    includeSafeArea?: boolean
    showSelection?: boolean
  } = {},
): Promise<HTMLCanvasElement> {
  await ensureFonts(state)

  const canvas = document.createElement('canvas')
  canvas.width = preset.width
  canvas.height = preset.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('export.canvasMissing')

  paintBackground(ctx, preset, state)

  if (state.backgroundImage) {
    const img = await getImage(state.backgroundImage)
    drawCover(
      ctx,
      img,
      preset.width,
      preset.height,
      state.imageZoom,
      state.imageOffsetX,
      state.imageOffsetY,
      state.bgBlur,
    )
  }

  // Tint only makes sense over a photo; solid/gradient backgrounds stay clean.
  if (state.backgroundImage && state.overlayOpacity > 0) {
    const { r, g, b } = hexToRgb(state.overlayColor)
    ctx.fillStyle = `rgba(${r},${g},${b},${state.overlayOpacity})`
    ctx.fillRect(0, 0, preset.width, preset.height)
  }

  for (const shape of state.shapes) {
    drawShape(ctx, shape)
  }

  if (options.includeSafeArea && preset.safeArea) {
    const { x, y, width, height } = preset.safeArea
    ctx.save()
    ctx.fillStyle = 'rgba(245, 165, 36, 0.08)'
    ctx.fillRect(x, y, width, height)
    ctx.strokeStyle = 'rgba(245, 165, 36, 0.55)'
    ctx.setLineDash([14, 10])
    ctx.lineWidth = 3
    ctx.strokeRect(x + 1.5, y + 1.5, width - 3, height - 3)
    ctx.restore()
  }

  for (const layer of state.texts) {
    paintTextLayer(ctx, preset, layer)
  }

  applyAllEffects(ctx, preset, state)

  if (options.showSelection) {
    paintGuides(ctx, preset, state)
    paintSelection(ctx, preset, state, state.selected)
  }

  return canvas
}

function paintGuides(
  ctx: CanvasRenderingContext2D,
  preset: Preset,
  state: EditorState,
) {
  if (!state.showGrid && !state.centerGuides) return

  ctx.save()

  if (state.showGrid && state.gridSize > 0) {
    const step = state.gridSize
    ctx.strokeStyle = `rgba(244, 241, 234, ${state.gridOpacity * 0.55})`
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = step; x < preset.width; x += step) {
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, preset.height)
    }
    for (let y = step; y < preset.height; y += step) {
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(preset.width, y + 0.5)
    }
    ctx.stroke()
  }

  if (state.centerGuides) {
    ctx.strokeStyle = 'rgba(245, 165, 36, 0.55)'
    ctx.lineWidth = 2
    ctx.setLineDash([10, 8])
    ctx.beginPath()
    ctx.moveTo(preset.width / 2 + 0.5, 0)
    ctx.lineTo(preset.width / 2 + 0.5, preset.height)
    ctx.moveTo(0, preset.height / 2 + 0.5)
    ctx.lineTo(preset.width, preset.height / 2 + 0.5)
    ctx.stroke()
  }

  ctx.restore()
}

export function hitTestText(
  preset: Preset,
  state: EditorState,
  px: number,
  py: number,
): TextLayer | null {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  for (let i = state.texts.length - 1; i >= 0; i--) {
    const layer = state.texts[i]
    const box = measureTextBox(ctx, preset, layer)
    const cx = box.x
    const cy = box.y
    let lx = px
    let ly = py
    if (layer.rotation) {
      const rad = (-layer.rotation * Math.PI) / 180
      const dx = px - cx
      const dy = py - cy
      lx = cx + dx * Math.cos(rad) - dy * Math.sin(rad)
      ly = cy + dx * Math.sin(rad) + dy * Math.cos(rad)
    }
    if (
      lx >= box.left - 10 &&
      lx <= box.left + box.width + 10 &&
      ly >= box.top - 6 &&
      ly <= box.top + box.height + 6
    ) {
      return layer
    }
  }
  return null
}

export async function exportPng(
  preset: Preset,
  state: EditorState,
  filename: string,
) {
  const canvas = await renderToCanvas(preset, state, {
    includeSafeArea: false,
    showSelection: false,
  })
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  )
  if (!blob) throw new Error('export.failed')

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
