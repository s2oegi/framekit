import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'

type Props = {
  open: boolean
  onClose: () => void
}

const ROWS: { keys: string; action: MessageKey }[] = [
  { keys: '⌘/Ctrl + Z', action: 'shortcuts.undo' },
  { keys: '⌘/Ctrl + Shift + Z', action: 'shortcuts.redo' },
  { keys: '⌘/Ctrl + Y', action: 'shortcuts.redo' },
  { keys: '⌘/Ctrl + S', action: 'shortcuts.save' },
  { keys: '⌘/Ctrl + D', action: 'shortcuts.duplicate' },
  { keys: '⌘/Ctrl + E', action: 'shortcuts.export' },
  { keys: 'Backspace / Delete', action: 'shortcuts.delete' },
  { keys: 'Esc', action: 'shortcuts.deselect' },
  { keys: '⌘/Ctrl + /', action: 'shortcuts.help' },
]

export function ShortcutsHelp({ open, onClose }: Props) {
  const { t } = useI18n()
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal modal-sm"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2>{t('editor.shortcuts')}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </header>
        <ul className="shortcut-list">
          {ROWS.map((row) => (
            <li key={row.keys}>
              <kbd>{row.keys}</kbd>
              <span>{t(row.action)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
