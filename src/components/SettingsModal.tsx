import { useI18n } from '../i18n/I18nContext'
import type { Locale } from '../i18n/messages'
import { useSettings, type ThemeMode } from '../settings/SettingsContext'

export function SettingsModal() {
  const { t, locale, setLocale } = useI18n()
  const {
    settingsOpen,
    closeSettings,
    theme,
    setTheme,
    brightness,
    setBrightness,
  } = useSettings()

  if (!settingsOpen) return null

  function pickLocale(next: Locale) {
    setLocale(next)
  }

  function pickTheme(next: ThemeMode) {
    setTheme(next)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={closeSettings}>
      <div
        className="modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2 id="settings-title">{t('settings.title')}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={closeSettings}
            aria-label={t('common.close')}
          >
            ×
          </button>
        </header>

        <section className="settings-section">
          <h3>{t('settings.language')}</h3>
          <div className="align-row">
            <button
              type="button"
              className={
                locale === 'en' ? 'chip chip-active' : 'chip'
              }
              onClick={() => pickLocale('en')}
            >
              {t('lang.en')}
            </button>
            <button
              type="button"
              className={
                locale === 'hu' ? 'chip chip-active' : 'chip'
              }
              onClick={() => pickLocale('hu')}
            >
              {t('lang.hu')}
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h3>{t('settings.theme')}</h3>
          <div className="align-row">
            <button
              type="button"
              className={theme === 'day' ? 'chip chip-active' : 'chip'}
              onClick={() => pickTheme('day')}
            >
              {t('settings.themeDay')}
            </button>
            <button
              type="button"
              className={theme === 'night' ? 'chip chip-active' : 'chip'}
              onClick={() => pickTheme('night')}
            >
              {t('settings.themeNight')}
            </button>
          </div>
          <p className="field-note">{t('settings.themeNote')}</p>
        </section>

        <section className="settings-section">
          <h3>
            {t('settings.brightness')} · {brightness}%
          </h3>
          <label className="field">
            <span className="sr-only">{t('settings.brightness')}</span>
            <input
              type="range"
              min={50}
              max={150}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
            />
          </label>
          <button
            type="button"
            className="linkish"
            onClick={() => setBrightness(100)}
          >
            {t('settings.brightnessReset')}
          </button>
        </section>
      </div>
    </div>
  )
}
