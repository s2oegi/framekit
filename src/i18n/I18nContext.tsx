import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  LOCALE_STORAGE_KEY,
  messages,
  type Locale,
  type MessageKey,
} from './messages'

type I18nValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  /** Translate known error keys; fall back to raw message */
  te: (message: string) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function readStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (raw === 'en' || raw === 'hu') return raw
  } catch {
    // ignore
  }
  // Default language is English
  return 'en'
}

function format(
  template: string,
  vars?: Record<string, string | number>,
) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] != null ? String(vars[key]) : `{${key}}`,
  )
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const table = messages[locale]
      return format(table[key] ?? messages.hu[key] ?? key, vars)
    },
    [locale],
  )

  const te = useCallback(
    (message: string) => {
      if (message in messages.hu) {
        return t(message as MessageKey)
      }
      return message
    },
    [t],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, te }),
    [locale, setLocale, t, te],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
