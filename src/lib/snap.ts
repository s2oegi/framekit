export function snapScalar(value: number, step: number, threshold: number) {
  if (step <= 0) return value
  const nearest = Math.round(value / step) * step
  return Math.abs(value - nearest) <= threshold ? nearest : value
}

function pickClosest(original: number, candidates: number[]) {
  let best = original
  let bestDist = Infinity
  for (const c of candidates) {
    const d = Math.abs(c - original)
    if (d < bestDist) {
      bestDist = d
      best = c
    }
  }
  return best
}

export type SnapOptions = {
  enabled: boolean
  step: number
  threshold: number
  canvasW: number
  canvasH: number
  centerGuides: boolean
}

/** Snap a shape's top-left so edges/center stick to grid (+ optional midlines). */
export function snapShapeOrigin(
  x: number,
  y: number,
  width: number,
  height: number,
  opt: SnapOptions,
) {
  if (!opt.enabled || opt.step <= 0) return { x, y }

  const { step, threshold, canvasW, canvasH, centerGuides } = opt
  const extrasX = centerGuides ? [canvasW / 2] : []
  const extrasY = centerGuides ? [canvasH / 2] : []

  function snapAxis(origin: number, size: number, extras: number[]) {
    const left = snapScalar(origin, step, threshold)
    const right = snapScalar(origin + size, step, threshold) - size
    const mid = snapScalar(origin + size / 2, step, threshold) - size / 2
    const candidates = [left, right, mid]
    for (const ex of extras) {
      candidates.push(ex - size / 2) // center on guide
      candidates.push(ex) // left edge on guide
      candidates.push(ex - size) // right edge on guide
    }
    // Only keep candidates within threshold of original
    const near = candidates.filter((c) => Math.abs(c - origin) <= threshold)
    return near.length ? pickClosest(origin, near) : origin
  }

  return {
    x: snapAxis(x, width, extrasX),
    y: snapAxis(y, height, extrasY),
  }
}

export function snapRect(
  x: number,
  y: number,
  width: number,
  height: number,
  opt: SnapOptions,
) {
  if (!opt.enabled || opt.step <= 0) {
    return { x, y, width, height }
  }

  const origin = snapShapeOrigin(x, y, width, height, opt)
  const right = snapScalar(origin.x + width, opt.step, opt.threshold)
  const bottom = snapScalar(origin.y + height, opt.step, opt.threshold)

  return {
    x: origin.x,
    y: origin.y,
    width: Math.max(20, right - origin.x),
    height: Math.max(20, bottom - origin.y),
  }
}

/** Text uses percent positions (0–100). */
export function snapTextPercent(
  xPercent: number,
  yPercent: number,
  opt: SnapOptions,
) {
  if (!opt.enabled || opt.step <= 0) {
    return {
      x: Math.min(100, Math.max(0, xPercent)),
      y: Math.min(100, Math.max(0, yPercent)),
    }
  }

  let px = (xPercent / 100) * opt.canvasW
  let py = (yPercent / 100) * opt.canvasH
  px = snapScalar(px, opt.step, opt.threshold)
  py = snapScalar(py, opt.step, opt.threshold)

  if (opt.centerGuides) {
    if (Math.abs(px - opt.canvasW / 2) <= opt.threshold) px = opt.canvasW / 2
    if (Math.abs(py - opt.canvasH / 2) <= opt.threshold) py = opt.canvasH / 2
  }

  return {
    x: Math.min(100, Math.max(0, (px / opt.canvasW) * 100)),
    y: Math.min(100, Math.max(0, (py / opt.canvasH) * 100)),
  }
}
