import { useEffect, useRef, useState } from 'react'
import { getPreset } from '../presets'
import type { EditorState } from '../types'
import { renderToCanvas } from '../lib/exportCanvas'
import { useI18n } from '../i18n/I18nContext'

type Props = {
  state: EditorState
  label: string
  description: string
  accent: string
  onClick: () => void
  onDelete?: () => void
  deleteLabel?: string
  cacheKey: string
}

const previewCache = new Map<string, string>()

export function TemplateTile({
  state,
  label,
  description,
  accent,
  onClick,
  onDelete,
  deleteLabel,
  cacheKey,
}: Props) {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef(state)
  stateRef.current = state
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setReady(false)
    setFailed(false)
    const canvas = canvasRef.current
    if (!canvas) return

    const snapshot = stateRef.current
    const preset = getPreset(snapshot.presetId)
    const maxW = snapshot.kind === 'banner' ? 420 : 320
    const scale = maxW / preset.width
    const tw = maxW
    const th = Math.max(1, Math.round(preset.height * scale))
    canvas.width = tw
    canvas.height = th

    async function paint() {
      try {
        const cached = previewCache.get(cacheKey)
        const ctx = canvas!.getContext('2d')
        if (!ctx) return

        if (cached) {
          const img = new Image()
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject()
            img.src = cached
          })
          if (cancelled) return
          ctx.clearRect(0, 0, tw, th)
          ctx.drawImage(img, 0, 0, tw, th)
          setReady(true)
          return
        }

        const full = await renderToCanvas(
          preset,
          { ...snapshot, selected: null, showSafeArea: false },
          { includeSafeArea: false, showSelection: false },
        )
        if (cancelled) return
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.clearRect(0, 0, tw, th)
        ctx.drawImage(full, 0, 0, tw, th)
        try {
          previewCache.set(cacheKey, canvas!.toDataURL('image/jpeg', 0.86))
        } catch {
          /* ignore quota */
        }
        setReady(true)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }

    void paint()
    return () => {
      cancelled = true
    }
  }, [cacheKey])

  return (
    <div className="template-tile">
      <button type="button" className="template-tile-btn" onClick={onClick}>
        <span
          className={
            state.kind === 'banner'
              ? 'template-tile-preview template-tile-preview-banner'
              : 'template-tile-preview'
          }
          style={{ ['--tile-accent' as string]: accent }}
        >
          <canvas
            ref={canvasRef}
            className={
              ready
                ? 'template-tile-canvas'
                : 'template-tile-canvas template-tile-canvas-loading'
            }
            aria-hidden
          />
          {!ready && !failed && <span className="template-tile-skeleton" />}
          {failed && (
            <span
              className="template-tile-fallback"
              style={{ background: accent }}
            />
          )}
          <span className="template-tile-overlay">
            <span className="template-tile-overlay-label">
              {t('templates.apply')}
            </span>
          </span>
        </span>
        <span className="template-tile-meta">
          <strong>{label}</strong>
          <span>{description}</span>
        </span>
      </button>
      {onDelete && (
        <button
          type="button"
          className="chip template-tile-delete"
          onClick={onDelete}
        >
          {deleteLabel ?? t('templates.delete')}
        </button>
      )}
    </div>
  )
}

export function invalidateTemplatePreview(cacheKey: string) {
  previewCache.delete(cacheKey)
}

export function clearTemplatePreviewCache() {
  previewCache.clear()
}
