import { useState } from 'react'
import type { Session } from '../lib/authStore'
import type { ProjectKind } from '../presets'
import type { SavedProject } from '../lib/projectStore'
import { listProjects } from '../lib/projectStore'
import { useI18n } from '../i18n/I18nContext'
import { useSettings } from '../settings/SettingsContext'
import { GamesModal } from './games/GamesModal'

type Props = {
  session: Session | null
  onSelectDesign: (kind: ProjectKind) => void
  onSelectVideo: () => void
  onOpenAuth: () => void
  onLogout: () => void
  onOpenProject: (project: SavedProject) => void
}

export function ModeSelect({
  session,
  onSelectDesign,
  onSelectVideo,
  onOpenAuth,
  onLogout,
  onOpenProject,
}: Props) {
  const { t } = useI18n()
  const { openSettings } = useSettings()
  const [gamesOpen, setGamesOpen] = useState(false)
  const recent = listProjects(session?.userId ?? null).slice(0, 4)

  return (
    <div className="mode-page">
      <div className="mode-glow" aria-hidden />

      <div className="mode-account">
        <button
          type="button"
          className="header-btn header-btn-accent"
          onClick={() => setGamesOpen(true)}
        >
          {t('games.menu')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={openSettings}
        >
          {t('common.settings')}
        </button>
        {session ? (
          <>
            <span className="mode-user">{session.displayName}</span>
            <button type="button" className="header-btn" onClick={onLogout}>
              {t('common.logout')}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="header-btn header-btn-accent"
            onClick={onOpenAuth}
          >
            {t('home.login')}
          </button>
        )}
      </div>

      <header className="mode-brand">
        <span className="logo-mark" aria-hidden />
        <h1>Framekit</h1>
      </header>

      <p className="mode-lead">{t('home.lead')}</p>

      <div className="mode-choices mode-choices-3">
        <button
          type="button"
          className="mode-card"
          onClick={() => onSelectDesign('thumbnail')}
        >
          <span className="mode-ratio">16:9 · 1280×720</span>
          <strong>Thumbnail</strong>
          <span>{t('home.thumbDesc')}</span>
        </button>
        <button
          type="button"
          className="mode-card"
          onClick={() => onSelectDesign('banner')}
        >
          <span className="mode-ratio">16:9 · 2560×1440</span>
          <strong>Banner</strong>
          <span>{t('home.bannerDesc')}</span>
        </button>
        <button
          type="button"
          className="mode-card mode-card-beta"
          onClick={onSelectVideo}
        >
          <span className="mode-card-top">
            <span className="mode-ratio">{t('home.videoRatio')}</span>
            <span className="beta-badge">{t('home.videoBeta')}</span>
          </span>
          <strong>{t('home.video')}</strong>
          <span>{t('home.videoDesc')}</span>
        </button>
      </div>

      {recent.length > 0 && (
        <section className="mode-recent">
          <h2>{t('home.recent')}</h2>
          <div className="mode-recent-list">
            {recent.map((p) => (
              <button
                key={p.id}
                type="button"
                className="mode-recent-item"
                onClick={() => onOpenProject(p)}
              >
                <strong>{p.name}</strong>
                <span>
                  {p.kind === 'thumbnail' ? 'Thumbnail' : 'Banner'}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <GamesModal open={gamesOpen} onClose={() => setGamesOpen(false)} />
    </div>
  )
}
