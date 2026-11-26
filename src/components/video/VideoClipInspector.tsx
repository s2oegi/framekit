import { layoutClips, transitionShortKey } from '../../video/mix'
import {
  clipStartOnTimeline,
  formatTime,
  getSource,
} from '../../video/timeline'
import {
  TRANSITION_OPTIONS,
  clipDuration,
  type TransitionType,
  type VideoClip,
  type VideoProject,
} from '../../video/types'
import { useI18n } from '../../i18n/I18nContext'

type Props = {
  project: VideoProject
  onTrimClip: (
    clipId: string,
    patch: { inPoint?: number; outPoint?: number },
  ) => void
  onSlipClip: (clipId: string, deltaSec: number) => void
  onPatchClip: (clipId: string, patch: Partial<VideoClip>) => void
}

export function VideoClipInspector({
  project,
  onTrimClip,
  onSlipClip,
  onPatchClip,
}: Props) {
  const { t } = useI18n()
  const clip = project.clips.find((c) => c.id === project.selectedClipId)
  if (!clip) return null
  const source = getSource(project, clip.sourceId)
  if (!source) return null

  const dur = clipDuration(clip)
  const maxSlip = Math.max(0, source.duration - dur)
  const layout = layoutClips(project.clips)
  const item = layout.find((l) => l.clip.id === clip.id)
  const hasNext = Boolean(item && item.index < project.clips.length - 1)
  const start = clipStartOnTimeline(project.clips, clip.id)
  const shortKey = transitionShortKey(clip.transition.type)

  return (
    <div className="video-inspector">
      <div className="video-inspector-head">
        <div>
          <strong>{source.name}</strong>
          <p className="field-note">
            {t('video.clip')} {(item?.index ?? 0) + 1} · {formatTime(dur, true)}{' '}
            · timeline {formatTime(start, true)}
          </p>
        </div>
        <button
          type="button"
          className={
            clip.muted ? 'header-btn header-btn-accent' : 'header-btn'
          }
          onClick={() => onPatchClip(clip.id, { muted: !clip.muted })}
          title="M"
        >
          {clip.muted ? t('video.mutedOn') : t('video.soundOn')}
        </button>
      </div>

      <section className="video-inspector-section">
        <h3>{t('video.cut')}</h3>
        <div className="video-inspector-grid">
          <label className="field">
            <span>In · {clip.inPoint.toFixed(2)}s</span>
            <input
              type="range"
              min={0}
              max={Math.max(0.1, source.duration)}
              step={0.01}
              value={clip.inPoint}
              onChange={(e) =>
                onTrimClip(clip.id, { inPoint: Number(e.target.value) })
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
                onTrimClip(clip.id, { outPoint: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            <span>{t('video.slip')}</span>
            <input
              type="range"
              min={0}
              max={Math.max(0.01, maxSlip)}
              step={0.01}
              value={Math.min(clip.inPoint, maxSlip)}
              disabled={maxSlip < 0.01}
              onChange={(e) => {
                const next = Number(e.target.value)
                onSlipClip(clip.id, next - clip.inPoint)
              }}
            />
          </label>
        </div>
      </section>

      <section className="video-inspector-section">
        <h3>{t('video.audio')}</h3>
        <div className="video-inspector-grid">
          <label className="field">
            <span>
              {t('video.volume')} · {Math.round(clip.volume * 100)}%
              {clip.muted ? ` (${t('common.muted')})` : ''}
            </span>
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.01}
              value={clip.volume}
              disabled={clip.muted}
              onChange={(e) =>
                onPatchClip(clip.id, { volume: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            <span>
              {t('video.fadeIn')} · {clip.fadeIn.toFixed(2)}s
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(0.05, Math.min(3, dur / 2))}
              step={0.05}
              value={Math.min(clip.fadeIn, dur / 2)}
              onChange={(e) =>
                onPatchClip(clip.id, { fadeIn: Number(e.target.value) })
              }
            />
          </label>
          <label className="field">
            <span>
              {t('video.fadeOut')} · {clip.fadeOut.toFixed(2)}s
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(0.05, Math.min(3, dur / 2))}
              step={0.05}
              value={Math.min(clip.fadeOut, dur / 2)}
              onChange={(e) =>
                onPatchClip(clip.id, { fadeOut: Number(e.target.value) })
              }
            />
          </label>
        </div>
      </section>

      <section className="video-inspector-section">
        <h3>{t('video.transition')}</h3>
        <div className="video-inspector-grid">
          <label className="field">
            <span>
              {t('video.transitionType')}
              {!hasNext
                ? t('video.noNext')
                : shortKey
                  ? ` · ${t(shortKey)}`
                  : ''}
            </span>
            <select
              value={clip.transition.type}
              disabled={!hasNext}
              onChange={(e) => {
                const type = e.target.value as TransitionType
                onPatchClip(clip.id, {
                  transition: {
                    type,
                    duration:
                      type === 'none'
                        ? clip.transition.duration
                        : Math.max(0.25, clip.transition.duration || 0.5),
                  },
                })
              }}
            >
              {TRANSITION_OPTIONS.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>
              {t('video.transitionLen')} · {clip.transition.duration.toFixed(2)}
              s
            </span>
            <input
              type="range"
              min={0.15}
              max={2}
              step={0.05}
              value={clip.transition.duration}
              disabled={!hasNext || clip.transition.type === 'none'}
              onChange={(e) =>
                onPatchClip(clip.id, {
                  transition: {
                    ...clip.transition,
                    duration: Number(e.target.value),
                  },
                })
              }
            />
          </label>
          <div className="video-trans-presets">
            {TRANSITION_OPTIONS.filter((o) => o.type !== 'none').map((opt) => (
              <button
                key={opt.type}
                type="button"
                className={
                  hasNext && clip.transition.type === opt.type
                    ? 'header-btn header-btn-accent'
                    : 'header-btn'
                }
                disabled={!hasNext}
                onClick={() =>
                  onPatchClip(clip.id, {
                    transition: {
                      type: opt.type,
                      duration: Math.max(0.35, clip.transition.duration || 0.5),
                    },
                  })
                }
              >
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
