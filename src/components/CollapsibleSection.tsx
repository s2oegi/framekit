import { useId, useState, type ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  storageKey?: string
}

function readStored(key: string | undefined, fallback: boolean): boolean {
  if (!key || typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    if (v === '0') return false
    if (v === '1') return true
  } catch {
    /* ignore */
  }
  return fallback
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  storageKey,
}: Props) {
  const [open, setOpen] = useState(() => readStored(storageKey, defaultOpen))
  const panelId = useId()

  function toggle() {
    setOpen((prev) => {
      const next = !prev
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, next ? '1' : '0')
        } catch {
          /* ignore */
        }
      }
      return next
    })
  }

  return (
    <section className={open ? 'control-section' : 'control-section control-section-collapsed'}>
      <button
        type="button"
        className="control-section-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
      >
        <h2>{title}</h2>
        <span className="control-section-chevron" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div id={panelId} className="control-section-body">
          {children}
        </div>
      )}
    </section>
  )
}
