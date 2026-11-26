import { FONTS } from '../../fonts'
import { useI18n } from '../../i18n/I18nContext'
import { brollEnd } from '../../video/broll'
import { getSource } from '../../video/timeline'
import { clipDuration } from '../../video/types'
import type {
  BrollClip,
  VideoProject,
  VideoTextOverlay,
} from '../../video/types'

type Props = {
  project: VideoProject
  onPatchBroll: (id: string, patch: Partial<BrollClip>) => void
  onPatchText: (id: string, patch: Partial<VideoTextOverlay>) => void
  onDeleteBroll: (id: string) => void
  onDeleteText: (id: string) => void
}

export function VideoOverlayInspector({
  project,
  onPatchBroll,
  onPatchText,
  onDeleteBroll,
  onDeleteText,
}: Props) {
  const { t } = useI18n()
  const sel = project.selected

  if (sel?.type === 'broll') {
    const clip = project.broll.find((c) => c.id === sel.id)
    if (!clip) return null
    const source = getSource(project, clip.sourceId)
    if (!source) return null
    const dur = clipDuration(clip)

    return (
      <div className="video-inspector">
        <div className="video-inspector-head">
          <div>
            <strong>
              {t('video.broll')} · {source.name}
            </strong>
            <p className="field-note">
              {dur.toFixed(2)}s · @{clip.timelineStart.toFixed(2)}s →{' '}
              {brollEnd(clip).toFixed(2)}s
            </p>
          </div>
          <button
            type="button"
            className="linkish danger"
            onClick={() => onDeleteBroll(clip.id)}
          >
            {t('common.delete')}
          </button>
        </div>
        <section className="video-inspector-section">
          <h3>{t('video.cut')}</h3>
          <div className="video-inspector-grid">
            <label className="field">
              <span>
                {t('video.timelineStart')} · {clip.timelineStart.toFixed(2)}s
              </span>
              <input
                type="range"
                min={0}
                max={120}
                step={0.05}
                value={clip.timelineStart}
                onChange={(e) =>
                  onPatchBroll(clip.id, {
                    timelineStart: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="field">
              <span>In · {clip.inPoint.toFixed(2)}s</span>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, source.duration)}
                step={0.01}
                value={clip.inPoint}
                onChange={(e) =>
                  onPatchBroll(clip.id, { inPoint: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Out · {clip.outPoint.toFixed(2)}s</span>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, source.duration)}
                step={0.01}
                value={clip.outPoint}
                onChange={(e) =>
                  onPatchBroll(clip.id, { outPoint: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>
                {t('video.opacity')} · {Math.round(clip.opacity * 100)}%
              </span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={clip.opacity}
                onChange={(e) =>
                  onPatchBroll(clip.id, { opacity: Number(e.target.value) })
                }
              />
            </label>
          </div>
        </section>
      </div>
    )
  }

  if (sel?.type === 'text') {
    const tx = project.texts.find((c) => c.id === sel.id)
    if (!tx) return null

    return (
      <div className="video-inspector">
        <div className="video-inspector-head">
          <div>
            <strong>{t('video.textOverlay')}</strong>
            <p className="field-note">
              {tx.start.toFixed(2)}s – {tx.end.toFixed(2)}s
            </p>
          </div>
          <button
            type="button"
            className="linkish danger"
            onClick={() => onDeleteText(tx.id)}
          >
            {t('common.delete')}
          </button>
        </div>
        <section className="video-inspector-section">
          <h3>{t('controls.text')}</h3>
          <div className="video-inspector-grid">
            <label className="field">
              <span>{t('controls.text')}</span>
              <input
                type="text"
                value={tx.text}
                onChange={(e) => onPatchText(tx.id, { text: e.target.value })}
              />
            </label>
            <label className="field">
              <span>
                {t('video.textStart')} · {tx.start.toFixed(2)}s
              </span>
              <input
                type="range"
                min={0}
                max={Math.max(0.1, tx.end - 0.2)}
                step={0.05}
                value={tx.start}
                onChange={(e) =>
                  onPatchText(tx.id, { start: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>
                {t('video.textEnd')} · {tx.end.toFixed(2)}s
              </span>
              <input
                type="range"
                min={tx.start + 0.2}
                max={180}
                step={0.05}
                value={tx.end}
                onChange={(e) =>
                  onPatchText(tx.id, { end: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>X · {Math.round(tx.x)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={tx.x}
                onChange={(e) =>
                  onPatchText(tx.id, { x: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Y · {Math.round(tx.y)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={tx.y}
                onChange={(e) =>
                  onPatchText(tx.id, { y: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>
                {t('controls.scale')} · {tx.fontSize}px
              </span>
              <input
                type="range"
                min={24}
                max={140}
                value={tx.fontSize}
                onChange={(e) =>
                  onPatchText(tx.id, { fontSize: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>{t('controls.color')}</span>
              <input
                type="color"
                value={tx.color}
                onChange={(e) => onPatchText(tx.id, { color: e.target.value })}
              />
            </label>
            <label className="field">
              <span>{t('video.font')}</span>
              <select
                value={tx.font}
                onChange={(e) => onPatchText(tx.id, { font: e.target.value })}
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="align-row">
              {(['left', 'center', 'right'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  className={tx.align === a ? 'chip chip-active' : 'chip'}
                  onClick={() => onPatchText(tx.id, { align: a })}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return null
}
