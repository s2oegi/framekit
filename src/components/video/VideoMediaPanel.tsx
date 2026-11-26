import { useI18n } from '../../i18n/I18nContext'
import type { VideoSource } from '../../video/types'

type Props = {
  sources: VideoSource[]
  onAddToMain: (sourceId: string) => void
  onAddToBroll: (sourceId: string) => void
}

export function VideoMediaPanel({
  sources,
  onAddToMain,
  onAddToBroll,
}: Props) {
  const { t } = useI18n()

  if (!sources.length) {
    return <p className="field-note">{t('video.mediaEmpty')}</p>
  }

  return (
    <div className="video-media-list">
      {sources.map((s) => (
        <div key={s.id} className="video-media-item">
          <div className="video-media-meta">
            <strong title={s.name}>{s.name}</strong>
            <span>{s.duration.toFixed(1)}s</span>
          </div>
          <div className="align-row">
            <button
              type="button"
              className="chip"
              onClick={() => onAddToMain(s.id)}
            >
              {t('video.addToMain')}
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => onAddToBroll(s.id)}
            >
              {t('video.addToBroll')}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
