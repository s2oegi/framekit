import { useI18n } from '../i18n/I18nContext'
import type { Locale } from '../i18n/messages'

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n()

  function pick(next: Locale) {
    setLocale(next)
  }

  return (
    <div
      className={compact ? 'lang-toggle lang-toggle-compact' : 'lang-toggle'}
      role="group"
      aria-label={t('lang.label')}
    >
      <button
        type="button"
        className={locale === 'hu' ? 'lang-btn lang-btn-active' : 'lang-btn'}
        onClick={() => pick('hu')}
      >
        {t('lang.hu')}
      </button>
      <button
        type="button"
        className={locale === 'en' ? 'lang-btn lang-btn-active' : 'lang-btn'}
        onClick={() => pick('en')}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}
