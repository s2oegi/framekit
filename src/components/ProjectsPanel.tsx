import { useState, type ChangeEvent } from 'react'
import type { Session } from '../lib/authStore'
import {
  deleteProject,
  exportProjectFile,
  importProjectFile,
  listProjects,
  type SavedProject,
} from '../lib/projectStore'
import type { ProjectKind } from '../presets'
import { useI18n } from '../i18n/I18nContext'
import { CollapsibleSection } from './CollapsibleSection'

type Props = {
  kind: ProjectKind
  projectId: string | null
  projectName: string
  session: Session | null
  onNameChange: (name: string) => void
  onSave: () => void
  onLoad: (project: SavedProject) => void
  onAskAuth: () => void
  status: string | null
  error: string | null
}

export function ProjectsPanel({
  kind,
  projectId,
  projectName,
  session,
  onNameChange,
  onSave,
  onLoad,
  onAskAuth,
  status,
  error,
}: Props) {
  const { t, te, locale } = useI18n()
  const [tick, setTick] = useState(0)
  const projects = listProjects(session?.userId ?? null)
  void tick

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importProjectFile(file)
      onLoad(imported)
    } catch (err) {
      alert(
        err instanceof Error ? te(err.message) : t('files.importFailed'),
      )
    }
    e.target.value = ''
  }

  function onDelete(id: string) {
    if (!confirm(t('files.confirmDelete'))) return
    try {
      deleteProject(id, session?.userId ?? null)
      setTick((n) => n + 1)
    } catch (err) {
      alert(
        err instanceof Error ? te(err.message) : t('files.deleteFailed'),
      )
    }
  }

  function onDownload(project: SavedProject) {
    exportProjectFile(project)
  }

  return (
    <>
      <CollapsibleSection title={t('files.save')} storageKey="ctrl-files-save">
        {!session && <p className="field-note">{t('files.saveNote')}</p>}
        <label className="field">
          <span>{t('files.projectName')}</span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>
        <button type="button" className="chip add-wide" onClick={onSave}>
          {projectId ? t('files.saveExisting') : t('files.saveNew')}
        </button>
        {status && <p className="save-status">{status}</p>}
        {error && <p className="export-error">{error}</p>}
        {!session && (
          <button type="button" className="linkish" onClick={onAskAuth}>
            {t('files.askAuth')}
          </button>
        )}
      </CollapsibleSection>

      <CollapsibleSection title={t('files.savedList')} storageKey="ctrl-files-list">
        {projects.length === 0 && (
          <p className="field-note">{t('files.empty')}</p>
        )}
        <div className="project-list">
          {projects.map((p) => (
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
                onClick={() => onLoad(p)}
              >
                <strong>{p.name}</strong>
                <span>
                  {p.kind === 'thumbnail' ? 'Thumbnail' : 'Banner'} ·{' '}
                  {new Date(p.updatedAt).toLocaleString(
                    locale === 'hu' ? 'hu-HU' : 'en-US',
                  )}
                </span>
              </button>
              <div className="project-actions">
                <button
                  type="button"
                  className="chip"
                  onClick={() => onDownload(p)}
                >
                  JSON
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onDelete(p.id)}
                >
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t('files.file')} storageKey="ctrl-files-file">
        <label className="field file-field">
          <span>{t('files.import')}</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={onImport}
          />
        </label>
        <p className="field-note">
          {t('files.modeNote', {
            kind: kind === 'thumbnail' ? 'Thumbnail' : 'Banner',
          })}
        </p>
      </CollapsibleSection>
    </>
  )
}
