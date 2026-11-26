import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import {
  deleteVideoProject,
  listVideoProjects,
} from '../../lib/videoProjectStore'

type Listed = {
  id: string
  name: string
  updatedAt: string
  createdAt: string
}

type Props = {
  projectId: string | null
  projectName: string
  onNameChange: (name: string) => void
  onSave: () => void
  onLoad: (id: string) => void
  status: string | null
  error: string | null
  refreshKey?: number
}

export function VideoProjectsPanel({
  projectId,
  projectName,
  onNameChange,
  onSave,
  onLoad,
  status,
  error,
  refreshKey = 0,
}: Props) {
  const { t, te, locale } = useI18n()
  const [items, setItems] = useState<Listed[]>([])

  const refresh = useCallback(async () => {
    try {
      setItems(await listVideoProjects())
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh, refreshKey])

  async function onDelete(id: string) {
    if (!confirm(t('files.confirmDelete'))) return
    try {
      await deleteVideoProject(id)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? te(err.message) : t('files.deleteFailed'))
    }
  }

  return (
    <div className="video-projects-panel">
      <section className="video-inspector-section">
        <h3>{t('video.saveProject')}</h3>
        <label className="field">
          <span>{t('files.projectName')}</span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>
        <button type="button" className="chip add-wide" onClick={onSave}>
          {projectId ? t('files.saveExisting') : t('video.saveNew')}
        </button>
        {status && <p className="save-status">{status}</p>}
        {error && <p className="export-error">{error}</p>}
      </section>

      <section className="video-inspector-section">
        <h3>{t('video.savedProjects')}</h3>
        {items.length === 0 && (
          <p className="field-note">{t('video.noSavedProjects')}</p>
        )}
        <div className="project-list">
          {items.map((p) => (
            <div
              key={p.id}
              className={
                p.id === projectId
                  ? 'project-item project-item-active'
                  : 'project-item'
              }
            >
              <button
                type="button"
                className="project-main"
                onClick={() => onLoad(p.id)}
              >
                <strong>{p.name}</strong>
                <span>
                  {new Date(p.updatedAt).toLocaleString(
                    locale === 'hu' ? 'hu-HU' : 'en-US',
                  )}
                </span>
              </button>
              <div className="project-actions">
                <button
                  type="button"
                  className="chip"
                  onClick={() => void onDelete(p.id)}
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="linkish"
          onClick={() => void refresh()}
        >
          {t('video.refreshList')}
        </button>
      </section>
    </div>
  )
}
