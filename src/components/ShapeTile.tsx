import { useEffect, useRef } from 'react'
import { drawShapeIcon } from '../lib/shapes'
import { shapeLabel, type ShapeKind } from '../types'
import { useI18n } from '../i18n/I18nContext'

type Props = {
  kind: ShapeKind
  onClick: () => void
}

export function ShapeTile({ kind, onClick }: Props) {
  const { locale } = useI18n()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const css = 64
    const dpr = Math.min(2.5, window.devicePixelRatio || 1)
    canvas.width = Math.round(css * dpr)
    canvas.height = Math.round(css * dpr)
    canvas.style.width = `${css}px`
    canvas.style.height = `${css}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, css, css)
    drawShapeIcon(ctx, kind, css, '#F5A524')
  }, [kind])

  return (
    <button
      type="button"
      className="shape-tile"
      onClick={onClick}
      title={shapeLabel(kind, locale)}
    >
      <canvas ref={ref} className="shape-tile-canvas" aria-hidden />
      <span>{shapeLabel(kind, locale)}</span>
    </button>
  )
}
