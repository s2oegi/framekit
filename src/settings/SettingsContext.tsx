import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemeMode = 'day' | 'night'

type SettingsValue = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  brightness: number
  setBrightness: (value: number) => void
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const THEME_KEY = 'framekit.theme'
const BRIGHTNESS_KEY = 'framekit.brightness'

const SettingsContext = createContext<SettingsValue | null>(null)

function readTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'day' || raw === 'night') return raw
  } catch {
    /* ignore */
  }
  return 'night'
}

function readBrightness(): number {
  try {
    const raw = Number(localStorage.getItem(BRIGHTNESS_KEY))
    if (Number.isFinite(raw) && raw >= 50 && raw <= 150) return raw
  } catch {
    /* ignore */
  }
  return 100
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
}

function applyBrightness(value: number) {
  document.documentElement.style.setProperty(
    '--ui-brightness',
    String(value / 100),
  )
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => readTheme())
  const [brightness, setBrightnessState] = useState(() => readBrightness())
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    applyBrightness(brightness)
  }, [brightness])

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const setBrightness = useCallback((value: number) => {
    const clamped = Math.min(150, Math.max(50, Math.round(value)))
    setBrightnessState(clamped)
    try {
      localStorage.setItem(BRIGHTNESS_KEY, String(clamped))
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      brightness,
      setBrightness,
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [theme, setTheme, brightness, setBrightness, settingsOpen],
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
