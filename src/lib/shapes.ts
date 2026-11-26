import type { CanvasShape } from '../types'

function regularPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  sides: number,
  rotation = -Math.PI / 2,
) {
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i * 2 * Math.PI) / sides
    const px = cx + rx * Math.cos(a)
    const py = cy + ry * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

function starPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  spikes: number,
  inner = 0.42,
) {
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 1 : inner
    const a = (Math.PI * i) / spikes - Math.PI / 2
    const px = cx + rx * r * Math.cos(a)
    const py = cy + ry * r * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

export function shapePath(
  ctx: CanvasRenderingContext2D,
  shape: CanvasShape,
) {
  const { kind, x, y, width: w, height: h, cornerRadius } = shape
  const cx = x + w / 2
  const cy = y + h / 2

  ctx.beginPath()

  switch (kind) {
    case 'rect':
    case 'bar':
    case 'line':
    case 'frame': {
      if (cornerRadius > 0 && kind !== 'line') {
        const r = Math.min(w, h) * (cornerRadius / 100)
        ctx.roundRect(x, y, w, h, r)
      } else {
        ctx.rect(x, y, w, h)
      }
      break
    }
    case 'round':
    case 'pill':
    case 'squircle': {
      const minR = kind === 'pill' ? 50 : kind === 'squircle' ? 35 : 22
      const r = Math.min(w, h) * (Math.max(cornerRadius, minR) / 100)
      ctx.roundRect(x, y, w, h, r)
      break
    }
    case 'circle':
    case 'ellipse':
    case 'ring':
    case 'badge':
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
      break
    case 'semicircle': {
      // Flat diameter on the bottom, arc above
      ctx.moveTo(x, y + h)
      ctx.lineTo(x + w, y + h)
      ctx.ellipse(cx, y + h, w / 2, h, 0, 0, Math.PI, true)
      ctx.closePath()
      break
    }
    case 'triangle':
      ctx.moveTo(cx, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      break
    case 'play': {
      const inset = w * 0.12
      ctx.moveTo(x + inset, y + h * 0.08)
      ctx.lineTo(x + w - inset * 0.2, cy)
      ctx.lineTo(x + inset, y + h * 0.92)
      ctx.closePath()
      break
    }
    case 'diamond':
      ctx.moveTo(cx, y)
      ctx.lineTo(x + w, cy)
      ctx.lineTo(cx, y + h)
      ctx.lineTo(x, cy)
      ctx.closePath()
      break
    case 'pentagon':
      regularPolygon(ctx, cx, cy, w / 2, h / 2, 5)
      break
    case 'hexagon':
      regularPolygon(ctx, cx, cy, w / 2, h / 2, 6, -Math.PI / 6)
      break
    case 'heptagon':
      regularPolygon(ctx, cx, cy, w / 2, h / 2, 7)
      break
    case 'octagon':
      regularPolygon(ctx, cx, cy, w / 2, h / 2, 8, Math.PI / 8)
      break
    case 'star':
      starPolygon(ctx, cx, cy, w / 2, h / 2, 5, 0.42)
      break
    case 'star6':
      starPolygon(ctx, cx, cy, w / 2, h / 2, 6, 0.45)
      break
    case 'star8':
      starPolygon(ctx, cx, cy, w / 2, h / 2, 8, 0.48)
      break
    case 'burst':
      starPolygon(ctx, cx, cy, w / 2, h / 2, 12, 0.55)
      break
    case 'sparkle':
      starPolygon(ctx, cx, cy, w / 2, h / 2, 4, 0.28)
      break
    case 'arrow': {
      const shaftH = h * 0.38
      const headW = w * 0.38
      const shaftTop = cy - shaftH / 2
      ctx.moveTo(x, shaftTop)
      ctx.lineTo(x + w - headW, shaftTop)
      ctx.lineTo(x + w - headW, y)
      ctx.lineTo(x + w, cy)
      ctx.lineTo(x + w - headW, y + h)
      ctx.lineTo(x + w - headW, shaftTop + shaftH)
      ctx.lineTo(x, shaftTop + shaftH)
      ctx.closePath()
      break
    }
    case 'arrowLeft': {
      const shaftH = h * 0.38
      const headW = w * 0.38
      const shaftTop = cy - shaftH / 2
      ctx.moveTo(x + w, shaftTop)
      ctx.lineTo(x + headW, shaftTop)
      ctx.lineTo(x + headW, y)
      ctx.lineTo(x, cy)
      ctx.lineTo(x + headW, y + h)
      ctx.lineTo(x + headW, shaftTop + shaftH)
      ctx.lineTo(x + w, shaftTop + shaftH)
      ctx.closePath()
      break
    }
    case 'arrowUp': {
      const shaftW = w * 0.38
      const headH = h * 0.38
      const shaftLeft = cx - shaftW / 2
      ctx.moveTo(shaftLeft, y + h)
      ctx.lineTo(shaftLeft, y + headH)
      ctx.lineTo(x, y + headH)
      ctx.lineTo(cx, y)
      ctx.lineTo(x + w, y + headH)
      ctx.lineTo(shaftLeft + shaftW, y + headH)
      ctx.lineTo(shaftLeft + shaftW, y + h)
      ctx.closePath()
      break
    }
    case 'arrowDown': {
      const shaftW = w * 0.38
      const headH = h * 0.38
      const shaftLeft = cx - shaftW / 2
      ctx.moveTo(shaftLeft, y)
      ctx.lineTo(shaftLeft, y + h - headH)
      ctx.lineTo(x, y + h - headH)
      ctx.lineTo(cx, y + h)
      ctx.lineTo(x + w, y + h - headH)
      ctx.lineTo(shaftLeft + shaftW, y + h - headH)
      ctx.lineTo(shaftLeft + shaftW, y)
      ctx.closePath()
      break
    }
    case 'doubleArrow': {
      const shaftH = h * 0.34
      const headW = w * 0.22
      const shaftTop = cy - shaftH / 2
      ctx.moveTo(x, cy)
      ctx.lineTo(x + headW, y)
      ctx.lineTo(x + headW, shaftTop)
      ctx.lineTo(x + w - headW, shaftTop)
      ctx.lineTo(x + w - headW, y)
      ctx.lineTo(x + w, cy)
      ctx.lineTo(x + w - headW, y + h)
      ctx.lineTo(x + w - headW, shaftTop + shaftH)
      ctx.lineTo(x + headW, shaftTop + shaftH)
      ctx.lineTo(x + headW, y + h)
      ctx.closePath()
      break
    }
    case 'chevron': {
      const cut = w * 0.35
      ctx.moveTo(x, y)
      ctx.lineTo(x + w - cut, y)
      ctx.lineTo(x + w, cy)
      ctx.lineTo(x + w - cut, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x + cut, cy)
      ctx.closePath()
      break
    }
    case 'parallelogram': {
      const skew = w * 0.22
      ctx.moveTo(x + skew, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w - skew, y + h)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      break
    }
    case 'trapezoid': {
      const inset = w * 0.18
      ctx.moveTo(x + inset, y)
      ctx.lineTo(x + w - inset, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      break
    }
    case 'cross':
    case 'plus': {
      const t = Math.min(w, h) * (kind === 'plus' ? 0.32 : 0.28)
      ctx.moveTo(cx - t / 2, y)
      ctx.lineTo(cx + t / 2, y)
      ctx.lineTo(cx + t / 2, cy - t / 2)
      ctx.lineTo(x + w, cy - t / 2)
      ctx.lineTo(x + w, cy + t / 2)
      ctx.lineTo(cx + t / 2, cy + t / 2)
      ctx.lineTo(cx + t / 2, y + h)
      ctx.lineTo(cx - t / 2, y + h)
      ctx.lineTo(cx - t / 2, cy + t / 2)
      ctx.lineTo(x, cy + t / 2)
      ctx.lineTo(x, cy - t / 2)
      ctx.lineTo(cx - t / 2, cy - t / 2)
      ctx.closePath()
      break
    }
    case 'heart': {
      ctx.moveTo(cx, y + h * 0.32)
      ctx.bezierCurveTo(
        cx - w * 0.05,
        y,
        x,
        y,
        x,
        y + h * 0.32,
      )
      ctx.bezierCurveTo(
        x,
        y + h * 0.55,
        cx - w * 0.08,
        y + h * 0.72,
        cx,
        y + h,
      )
      ctx.bezierCurveTo(
        cx + w * 0.08,
        y + h * 0.72,
        x + w,
        y + h * 0.55,
        x + w,
        y + h * 0.32,
      )
      ctx.bezierCurveTo(
        x + w,
        y,
        cx + w * 0.05,
        y,
        cx,
        y + h * 0.32,
      )
      ctx.closePath()
      break
    }
    case 'bubble':
    case 'speech': {
      const r = Math.min(w, h) * 0.2
      const bodyH = h * 0.7
      const bottom = y + bodyH
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, bottom - r)
      ctx.quadraticCurveTo(x + w, bottom, x + w - r, bottom)
      ctx.lineTo(x + w * 0.42, bottom)
      ctx.lineTo(x + w * 0.28, y + h)
      ctx.lineTo(x + w * 0.32, bottom)
      ctx.lineTo(x + r, bottom)
      ctx.quadraticCurveTo(x, bottom, x, bottom - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      break
    }
    case 'crescent': {
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2)
      break
    }
    case 'ribbon': {
      const cut = Math.min(w * 0.14, h * 0.55)
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w - cut, cy)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x + cut, cy)
      ctx.closePath()
      break
    }
    case 'banner': {
      const notch = h * 0.38
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(cx, y + h - notch)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      break
    }
    case 'tag': {
      const tip = w * 0.28
      const r = Math.min(w, h) * 0.12
      ctx.moveTo(x + tip, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + tip, y + h)
      ctx.lineTo(x, cy)
      ctx.closePath()
      break
    }
    case 'ticket': {
      const nip = Math.min(w, h) * 0.14
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, cy - nip)
      ctx.arc(x + w, cy, nip, -Math.PI / 2, Math.PI / 2, true)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.lineTo(x, cy + nip)
      ctx.arc(x, cy, nip, Math.PI / 2, -Math.PI / 2, true)
      ctx.closePath()
      break
    }
    case 'shield': {
      ctx.moveTo(cx, y)
      ctx.lineTo(x + w, y + h * 0.22)
      ctx.lineTo(x + w, y + h * 0.58)
      ctx.quadraticCurveTo(x + w, y + h * 0.82, cx, y + h)
      ctx.quadraticCurveTo(x, y + h * 0.82, x, y + h * 0.58)
      ctx.lineTo(x, y + h * 0.22)
      ctx.closePath()
      break
    }
    case 'lightning': {
      ctx.moveTo(x + w * 0.55, y)
      ctx.lineTo(x + w * 0.2, y + h * 0.45)
      ctx.lineTo(x + w * 0.48, y + h * 0.45)
      ctx.lineTo(x + w * 0.35, y + h)
      ctx.lineTo(x + w * 0.82, y + h * 0.42)
      ctx.lineTo(x + w * 0.52, y + h * 0.42)
      ctx.closePath()
      break
    }
    case 'cloud': {
      const baseY = y + h * 0.72
      ctx.moveTo(x + w * 0.12, baseY)
      ctx.arc(x + w * 0.22, baseY - h * 0.02, h * 0.26, Math.PI * 0.85, Math.PI * 1.85)
      ctx.arc(x + w * 0.42, y + h * 0.4, h * 0.34, Math.PI * 1.05, Math.PI * 1.95)
      ctx.arc(x + w * 0.68, y + h * 0.42, h * 0.3, Math.PI * 1.15, Math.PI * 0.2)
      ctx.arc(x + w * 0.84, baseY - h * 0.04, h * 0.24, Math.PI * 1.65, Math.PI * 0.45)
      ctx.lineTo(x + w * 0.12, baseY + h * 0.05)
      ctx.closePath()
      break
    }
    case 'teardrop': {
      ctx.moveTo(cx, y)
      ctx.bezierCurveTo(x + w, y + h * 0.35, x + w, y + h * 0.7, cx, y + h)
      ctx.bezierCurveTo(x, y + h * 0.7, x, y + h * 0.35, cx, y)
      ctx.closePath()
      break
    }
    case 'bookmark': {
      ctx.moveTo(x, y)
      ctx.lineTo(x + w, y)
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(cx, y + h * 0.72)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      break
    }
    case 'flag': {
      const pole = Math.max(4, w * 0.1)
      ctx.moveTo(x, y)
      ctx.lineTo(x + pole, y)
      ctx.lineTo(x + pole, y + h)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      ctx.moveTo(x + pole, y)
      ctx.lineTo(x + w, y + h * 0.18)
      ctx.lineTo(x + pole + w * 0.55, y + h * 0.34)
      ctx.lineTo(x + w, y + h * 0.5)
      ctx.lineTo(x + pole, y + h * 0.66)
      ctx.closePath()
      break
    }
    case 'check': {
      const t = Math.min(w, h) * 0.16
      ctx.moveTo(x + w * 0.1, cy - t * 0.2)
      ctx.lineTo(x + w * 0.12 + t, cy - t * 0.2)
      ctx.lineTo(x + w * 0.38, y + h * 0.68 - t)
      ctx.lineTo(x + w * 0.86 - t, y + h * 0.18)
      ctx.lineTo(x + w * 0.9, y + h * 0.18 + t * 0.9)
      ctx.lineTo(x + w * 0.38, y + h * 0.82)
      ctx.closePath()
      break
    }
    case 'xmark': {
      const t = Math.min(w, h) * 0.18
      ctx.moveTo(x + t, y)
      ctx.lineTo(cx, cy - t * 0.6)
      ctx.lineTo(x + w - t, y)
      ctx.lineTo(x + w, y + t)
      ctx.lineTo(cx + t * 0.6, cy)
      ctx.lineTo(x + w, y + h - t)
      ctx.lineTo(x + w - t, y + h)
      ctx.lineTo(cx, cy + t * 0.6)
      ctx.lineTo(x + t, y + h)
      ctx.lineTo(x, y + h - t)
      ctx.lineTo(cx - t * 0.6, cy)
      ctx.lineTo(x, y + t)
      ctx.closePath()
      break
    }
    case 'wave': {
      ctx.moveTo(x, y + h * 0.55)
      ctx.bezierCurveTo(
        x + w * 0.2,
        y,
        x + w * 0.3,
        y + h,
        x + w * 0.5,
        y + h * 0.55,
      )
      ctx.bezierCurveTo(
        x + w * 0.7,
        y,
        x + w * 0.8,
        y + h,
        x + w,
        y + h * 0.55,
      )
      ctx.lineTo(x + w, y + h)
      ctx.lineTo(x, y + h)
      ctx.closePath()
      break
    }
  }
}

function fillStyleFor(
  ctx: CanvasRenderingContext2D,
  shape: CanvasShape,
): string | CanvasGradient {
  if (!shape.useGradient) return shape.fill
  const rad = (shape.gradientAngle * Math.PI) / 180
  const cx = shape.x + shape.width / 2
  const cy = shape.y + shape.height / 2
  const len = Math.hypot(shape.width, shape.height) / 2
  const grad = ctx.createLinearGradient(
    cx - Math.cos(rad) * len,
    cy - Math.sin(rad) * len,
    cx + Math.cos(rad) * len,
    cy + Math.sin(rad) * len,
  )
  grad.addColorStop(0, shape.fill)
  grad.addColorStop(1, shape.fill2)
  return grad
}

export function drawShape(ctx: CanvasRenderingContext2D, shape: CanvasShape) {
  ctx.save()
  ctx.globalAlpha = shape.opacity
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.miterLimit = 2.5

  const cx = shape.x + shape.width / 2
  const cy = shape.y + shape.height / 2
  if (shape.rotation) {
    ctx.translate(cx, cy)
    ctx.rotate((shape.rotation * Math.PI) / 180)
    ctx.translate(-cx, -cy)
  }

  if (shape.shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.45)'
    ctx.shadowBlur = shape.shadowBlur
    ctx.shadowOffsetX = shape.shadowOffsetX
    ctx.shadowOffsetY = shape.shadowOffsetY
  }

  if (shape.kind === 'line') {
    ctx.strokeStyle = shape.fill !== 'transparent' ? shape.fill : shape.stroke
    ctx.lineWidth = Math.max(2, shape.strokeWidth || shape.height)
    ctx.beginPath()
    ctx.moveTo(shape.x, cy)
    ctx.lineTo(shape.x + shape.width, cy)
    ctx.stroke()
  } else if (shape.kind === 'ring' || shape.kind === 'frame') {
    shapePath(ctx, shape)
    ctx.strokeStyle = shape.stroke || shape.fill
    ctx.lineWidth = Math.max(
      4,
      shape.strokeWidth || (shape.kind === 'frame' ? 14 : 16),
    )
    ctx.stroke()
  } else if (shape.kind === 'badge') {
    shapePath(ctx, shape)
    if (shape.fill && shape.fill !== 'transparent') {
      ctx.fillStyle = fillStyleFor(ctx, shape)
      ctx.fill()
    }
    ctx.shadowColor = 'transparent'
    const ringW = Math.max(
      3,
      shape.strokeWidth || Math.min(shape.width, shape.height) * 0.08,
    )
    ctx.beginPath()
    ctx.ellipse(
      cx,
      cy,
      Math.max(2, shape.width / 2 - ringW * 1.4),
      Math.max(2, shape.height / 2 - ringW * 1.4),
      0,
      0,
      Math.PI * 2,
    )
    ctx.strokeStyle = shape.stroke || '#ffffff'
    ctx.lineWidth = ringW
    ctx.stroke()
  } else if (shape.kind === 'crescent') {
    const rx = shape.width / 2
    const ry = shape.height / 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.ellipse(
      cx + rx * 0.35,
      cy - ry * 0.06,
      rx * 0.76,
      ry * 0.76,
      0,
      0,
      Math.PI * 2,
    )
    ctx.fillStyle = fillStyleFor(ctx, shape)
    ctx.fill('evenodd')
    ctx.shadowColor = 'transparent'
    if (shape.strokeWidth > 0) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.strokeStyle = shape.stroke
      ctx.lineWidth = shape.strokeWidth
      ctx.stroke()
    }
  } else {
    shapePath(ctx, shape)
    if (shape.fill && shape.fill !== 'transparent') {
      ctx.fillStyle = fillStyleFor(ctx, shape)
      ctx.fill()
    }
    ctx.shadowColor = 'transparent'
    if (shape.strokeWidth > 0) {
      shapePath(ctx, shape)
      ctx.strokeStyle = shape.stroke
      ctx.lineWidth = shape.strokeWidth
      ctx.stroke()
    }
  }

  ctx.restore()
}

export function hitTestShape(
  shape: CanvasShape,
  px: number,
  py: number,
): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return false

  const cx = shape.x + shape.width / 2
  const cy = shape.y + shape.height / 2
  let lx = px
  let ly = py
  if (shape.rotation) {
    const rad = (-shape.rotation * Math.PI) / 180
    const dx = px - cx
    const dy = py - cy
    lx = cx + dx * Math.cos(rad) - dy * Math.sin(rad)
    ly = cy + dx * Math.sin(rad) + dy * Math.cos(rad)
  }

  if (shape.kind === 'line') {
    const pad = Math.max(12, (shape.strokeWidth || shape.height) / 2 + 8)
    return (
      lx >= shape.x &&
      lx <= shape.x + shape.width &&
      ly >= cy - pad &&
      ly <= cy + pad
    )
  }

  if (shape.kind === 'crescent') {
    const rx = shape.width / 2
    const ry = shape.height / 2
    const inOuter =
      ((lx - cx) ** 2) / (rx * rx) + ((ly - cy) ** 2) / (ry * ry) <= 1
    const ox = cx + rx * 0.35
    const oy = cy - ry * 0.06
    const irx = rx * 0.76
    const iry = ry * 0.76
    const inInner =
      ((lx - ox) ** 2) / (irx * irx) + ((ly - oy) ** 2) / (iry * iry) <= 1
    return inOuter && !inInner
  }

  shapePath(ctx, shape)
  if (shape.kind === 'ring') {
    const dx = lx - cx
    const dy = ly - cy
    const rx = shape.width / 2
    const ry = shape.height / 2
    const n = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)
    const thickness = Math.max(4, shape.strokeWidth || 16)
    const inner =
      1 - Math.min(0.7, thickness / Math.min(rx, ry))
    return n <= 1.05 && n >= inner * inner * 0.85
  }

  if (shape.kind === 'frame') {
    const thickness = Math.max(4, shape.strokeWidth || 14)
    ctx.lineWidth = thickness + 10
    return ctx.isPointInStroke(lx, ly) || (() => {
      const inset = thickness
      const inside =
        lx > shape.x + inset &&
        lx < shape.x + shape.width - inset &&
        ly > shape.y + inset &&
        ly < shape.y + shape.height - inset
      const outside =
        lx >= shape.x - 4 &&
        lx <= shape.x + shape.width + 4 &&
        ly >= shape.y - 4 &&
        ly <= shape.y + shape.height + 4
      return outside && !inside
    })()
  }

  return ctx.isPointInPath(lx, ly)
}

export function findTopShapeAt(
  shapes: CanvasShape[],
  x: number,
  y: number,
): CanvasShape | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (hitTestShape(shapes[i], x, y)) return shapes[i]
  }
  return null
}

export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se'

export function getResizeHandles(shape: CanvasShape, pad = 6) {
  const cx = shape.x + shape.width / 2
  const cy = shape.y + shape.height / 2
  const hw = shape.width / 2 + pad
  const hh = shape.height / 2 + pad
  const rad = (shape.rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  function map(lx: number, ly: number) {
    return {
      x: cx + lx * cos - ly * sin,
      y: cy + lx * sin + ly * cos,
    }
  }

  return {
    nw: map(-hw, -hh),
    ne: map(hw, -hh),
    sw: map(-hw, hh),
    se: map(hw, hh),
  } as Record<ResizeHandle, { x: number; y: number }>
}

export function hitTestResizeHandle(
  shape: CanvasShape,
  px: number,
  py: number,
  hitRadius = 18,
): ResizeHandle | null {
  const handles = getResizeHandles(shape)
  for (const key of Object.keys(handles) as ResizeHandle[]) {
    const h = handles[key]
    if (Math.hypot(px - h.x, py - h.y) <= hitRadius) return key
  }
  return null
}

/** Compact icon used in shape picker tiles */
export function drawShapeIcon(
  ctx: CanvasRenderingContext2D,
  kind: CanvasShape['kind'],
  size: number,
  color: string,
) {
  ctx.save()
  ctx.clearRect(0, 0, size, size)

  // Soft plate behind the glyph
  ctx.beginPath()
  ctx.roundRect(size * 0.06, size * 0.06, size * 0.88, size * 0.88, size * 0.18)
  ctx.fillStyle = 'rgba(245, 165, 36, 0.08)'
  ctx.fill()

  const pad = size * 0.2
  const shape: CanvasShape = {
    id: 'icon',
    kind,
    x: pad,
    y: pad,
    width: size - pad * 2,
    height: size - pad * 2,
    fill: color,
    fill2: '#FF7A1A',
    useGradient: kind === 'burst' || kind === 'diamond',
    gradientAngle: 135,
    stroke: kind === 'frame' || kind === 'ring' ? color : '#FFFFFF',
    strokeWidth:
      kind === 'ring' || kind === 'frame'
        ? Math.max(3, size * 0.09)
        : kind === 'badge'
          ? Math.max(2, size * 0.05)
          : 0,
    cornerRadius: kind === 'pill' ? 50 : kind === 'round' ? 28 : 14,
    opacity: 1,
    rotation: 0,
    shadow: false,
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  }

  if (kind === 'line') {
    shape.height = Math.max(4, size * 0.1)
    shape.y = size / 2 - shape.height / 2
    shape.fill = color
  }
  if (kind === 'bar') {
    shape.height = Math.max(6, size * 0.18)
    shape.y = size / 2 - shape.height / 2
  }
  if (kind === 'wave') {
    shape.height = size * 0.42
    shape.y = size * 0.36
  }
  if (kind === 'banner' || kind === 'ribbon' || kind === 'flag') {
    shape.height = size * 0.55
    shape.y = size * 0.22
  }

  drawShape(ctx, shape)
  ctx.restore()
}

export function applyResize(
  shape: CanvasShape,
  handle: ResizeHandle,
  px: number,
  py: number,
): Partial<CanvasShape> {
  const cx = shape.x + shape.width / 2
  const cy = shape.y + shape.height / 2
  const rad = (-shape.rotation * Math.PI) / 180
  const dx = px - cx
  const dy = py - cy
  const lx = dx * Math.cos(rad) - dy * Math.sin(rad)
  const ly = dx * Math.sin(rad) + dy * Math.cos(rad)

  let left = -shape.width / 2
  let right = shape.width / 2
  let top = -shape.height / 2
  let bottom = shape.height / 2

  if (handle.includes('w')) left = Math.min(lx, right - 20)
  if (handle.includes('e')) right = Math.max(lx, left + 20)
  if (handle.includes('n')) top = Math.min(ly, bottom - 20)
  if (handle.includes('s')) bottom = Math.max(ly, top + 20)

  const width = right - left
  const height = bottom - top
  const localCx = (left + right) / 2
  const localCy = (top + bottom) / 2
  const worldRad = (shape.rotation * Math.PI) / 180
  const newCx = cx + localCx * Math.cos(worldRad) - localCy * Math.sin(worldRad)
  const newCy = cy + localCx * Math.sin(worldRad) + localCy * Math.cos(worldRad)

  return {
    width,
    height,
    x: newCx - width / 2,
    y: newCy - height / 2,
  }
}
