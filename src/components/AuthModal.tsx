import { useState, type FormEvent } from 'react'
import {
  loginUser,
  registerUser,
  type Session,
} from '../lib/authStore'
import { useI18n } from '../i18n/I18nContext'

type Props = {
  open: boolean
  onClose: () => void
  onAuthed: (session: Session) => void
}

export function AuthModal({ open, onClose, onAuthed }: Props) {
  const { t, te } = useI18n()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [code, setCode] = useState('')

  if (!open) return null

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'login') {
        const session = await loginUser(username || email, code)
        onAuthed(session)
        onClose()
      } else {
        const session = await registerUser({
          username,
          email,
          phone,
          displayName,
          code,
        })
        onAuthed(session)
        onClose()
      }
    } catch (err) {
      setError(
        err instanceof Error ? te(err.message) : t('auth.failed'),
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2 id="auth-title">
            {mode === 'login' ? t('auth.titleLogin') : t('auth.titleRegister')}
          </h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </header>

        <p className="modal-note">{t('auth.note')}</p>

        <div className="align-row">
          <button
            type="button"
            className={mode === 'login' ? 'chip chip-active' : 'chip'}
            onClick={() => {
              setMode('login')
              setError(null)
            }}
          >
            {t('auth.tabLogin')}
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'chip chip-active' : 'chip'}
            onClick={() => {
              setMode('register')
              setError(null)
            }}
          >
            {t('auth.tabRegister')}
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label className="field">
                <span>{t('auth.displayName')}</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>{t('auth.username')}</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </label>
              <label className="field">
                <span>{t('auth.email')}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="field">
                <span>{t('auth.phone')}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="+36 ..."
                />
              </label>
            </>
          )}

          {mode === 'login' && (
            <label className="field">
              <span>{t('auth.usernameOrEmail')}</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </label>
          )}

          <label className="field">
            <span>{t('auth.code')}</span>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              minLength={4}
            />
          </label>

          {error && <p className="export-error">{error}</p>}

          <button type="submit" className="export-btn" disabled={busy}>
            {busy
              ? t('common.busy')
              : mode === 'login'
                ? t('auth.submitLogin')
                : t('auth.submitRegister')}
          </button>
        </form>
      </div>
    </div>
  )
}
