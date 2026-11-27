import { useI18n } from '../../i18n/I18nContext'

type Props = {
  open: boolean
  onClose: () => void
}

const MATCHER_SRC = '/games/matcher/index.html'

export function GamesModal({ open, onClose }: Props) {
  const { t } = useI18n()

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal games-modal games-modal-play"
        role="dialog"
        aria-modal="true"
        aria-labelledby="games-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <div className="games-modal-title">
            <h2 id="games-title">{t('games.matchingTitle')}</h2>
            <p className="field-note">{t('games.matchingDesc')}</p>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            ×
          </button>
        </header>

        <iframe
          className="games-frame"
          title={t('games.matchingTitle')}
          src={MATCHER_SRC}
          allow="autoplay"
        />
      </div>
    </div>
  )
}
