import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nContext'
import { SettingsProvider } from './settings/SettingsContext'
import { SettingsModal } from './components/SettingsModal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <SettingsProvider>
        <App />
        <SettingsModal />
      </SettingsProvider>
    </I18nProvider>
  </StrictMode>,
)
