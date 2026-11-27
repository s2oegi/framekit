import { useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { MatchingGame } from './MatchingGame'

type Props = {
  open: boolean
  onClose: () => void
}

type View = 'list' | 'matching'

export function GamesModal({ open, onClose }: Props) {
  const { t } = useI18n()
  const [view, setView] = useState<View>('list')

  if (!open) return null

  function close() {
    setView('list')
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={close}>
      <div
        className={
          view === 'matching' ? 'modal games-modal games-modal-wide' : 'modal games-modal'
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="games-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2 id="games-title">
            {view === 'list' ? t('games.title') : t('games.matchingTitle')}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={close}
            aria-label={t('common.close')}
          >
            ×
          </button>
        </header>

        {view === 'list' ? (
          <div className="games-list">
            <p className="field-note">{t('games.lead')}</p>
            <button
              type="button"
              className="games-card"
              onClick={() => setView('matching')}
            >
              <span className="games-card-icon" aria-hidden>
                🃏
              </span>
              <span className="games-card-copy">
                <strong>{t('games.matchingTitle')}</strong>
                <span>{t('games.matchingDesc')}</span>
              </span>
              <span className="games-card-go">→</span>
            </button>
          </div>
        ) : (
          <MatchingGame onBack={() => setView('list')} />
        )}
      </div>
    </div>
  )
}
