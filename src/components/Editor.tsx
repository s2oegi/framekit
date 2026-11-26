import { useCallback, useEffect, useRef, useState } from 'react'
import type { ProjectKind } from '../presets'
import { getPreset } from '../presets'
import {
  defaultEditorState,
  duplicateShape,
  duplicateText,
  type CanvasShape,
  type EditorState,
  type SelectedTarget,
  type TextLayer,
} from '../types'
import { exportPng } from '../lib/exportCanvas'
import type { Session } from '../lib/authStore'
import { saveProject, type SavedProject } from '../lib/projectStore'
import { rematerializeState } from '../lib/templateStore'
import { useEditorHistory } from '../hooks/useEditorHistory'
import { useI18n } from '../i18n/I18nContext'
import { AuthModal } from './AuthModal'
import { CanvasPreview } from './CanvasPreview'
import { Controls } from './Controls'
import { ShortcutsHelp } from './ShortcutsHelp'
import { useSettings } from '../settings/SettingsContext'

type Props = {
  kind: ProjectKind
  session: Session | null
  onSession: (session: Session | null) => void
  onBack: () => void
  initialProject?: SavedProject | null
}

export function Editor({
  kind,
  session,
  onSession,
  onBack,
  initialProject = null,
}: Props) {
  const { t, te, locale } = useI18n()
  const { openSettings } = useSettings()
  const initial =
    initialProject?.state ??
    defaultEditorState(initialProject?.kind ?? kind, locale)

  const {
    state,
    commit,
    replace,
    beginGesture,
    endGesture,
    undo,
    redo,
    resetHistory,
  } = useEditorHistory({
    ...initial,
    kind: initialProject?.kind ?? kind,
    presetId:
      (initialProject?.kind ?? kind) === 'thumbnail' ? 'yt-thumb' : 'yt-banner',
  })

  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(
    initialProject?.id ?? null,
  )
  const [projectName, setProjectName] = useState(
    initialProject?.name ??
      (kind === 'thumbnail'
        ? t('editor.newThumbnail')
        : t('editor.newBanner')),
  )
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(() => {
    try {
      return localStorage.getItem('framekit-panel-open') !== '0'
    } catch {
      return true
    }
  })
  const stateRef = useRef(state)

  function setPanel(open: boolean) {
    setPanelOpen(open)
    try {
      localStorage.setItem('framekit-panel-open', open ? '1' : '0')
    } catch {
      /* ignore */
    }
  }
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const preset = getPreset(state.presetId)

  function patch(partial: Partial<EditorState>) {
    commit((prev) => ({ ...prev, ...partial }))
  }

  function applyTemplate(next: EditorState) {
    const fresh = rematerializeState(next)
    resetHistory({
      ...fresh,
      kind: state.kind,
      presetId: state.kind === 'thumbnail' ? 'yt-thumb' : 'yt-banner',
      showSafeArea: state.kind === 'banner' ? fresh.showSafeArea : false,
      selected: null,
    })
    setExportError(null)
  }

  function updateShape(id: string, shapePatch: Partial<CanvasShape>, live = false) {
    const apply = live ? replace : commit
    apply((prev) => ({
      ...prev,
      shapes: prev.shapes.map((s) =>
        s.id === id ? { ...s, ...shapePatch } : s,
      ),
    }))
  }

  function removeShape(id: string) {
    commit((prev) => ({
      ...prev,
      shapes: prev.shapes.filter((s) => s.id !== id),
      selected:
        prev.selected?.type === 'shape' && prev.selected.id === id
          ? null
          : prev.selected,
    }))
  }

  function reorderShape(id: string, dir: -1 | 1 | 'front' | 'back') {
    commit((prev) => {
      const idx = prev.shapes.findIndex((s) => s.id === id)
      if (idx < 0) return prev
      const shapes = [...prev.shapes]
      const [item] = shapes.splice(idx, 1)
      if (dir === 'front') shapes.push(item)
      else if (dir === 'back') shapes.unshift(item)
      else {
        const next = idx + dir
        if (next < 0 || next > shapes.length) {
          shapes.splice(idx, 0, item)
          return prev
        }
        shapes.splice(next, 0, item)
      }
      return { ...prev, shapes }
    })
  }

  function dupShape(id: string) {
    commit((prev) => {
      const shape = prev.shapes.find((s) => s.id === id)
      if (!shape) return prev
      const copy = duplicateShape(shape)
      return {
        ...prev,
        shapes: [...prev.shapes, copy],
        selected: { type: 'shape', id: copy.id },
      }
    })
  }

  function alignShape(id: string, where: 'h' | 'v' | 'c') {
    commit((prev) => {
      const shape = prev.shapes.find((s) => s.id === id)
      if (!shape) return prev
      const p = getPreset(prev.presetId)
      let x = shape.x
      let y = shape.y
      if (where === 'h' || where === 'c') x = (p.width - shape.width) / 2
      if (where === 'v' || where === 'c') y = (p.height - shape.height) / 2
      return {
        ...prev,
        shapes: prev.shapes.map((s) =>
          s.id === id ? { ...s, x, y } : s,
        ),
      }
    })
  }

  function updateText(id: string, textPatch: Partial<TextLayer>, live = false) {
    const apply = live ? replace : commit
    apply((prev) => ({
      ...prev,
      texts: prev.texts.map((t) =>
        t.id === id ? { ...t, ...textPatch } : t,
      ),
    }))
  }

  function removeText(id: string) {
    commit((prev) => {
      if (prev.texts.length <= 1) return prev
      return {
        ...prev,
        texts: prev.texts.filter((t) => t.id !== id),
        selected:
          prev.selected?.type === 'text' && prev.selected.id === id
            ? null
            : prev.selected,
      }
    })
  }

  function reorderText(id: string, dir: -1 | 1) {
    commit((prev) => {
      const idx = prev.texts.findIndex((t) => t.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.texts.length) return prev
      const texts = [...prev.texts]
      const [item] = texts.splice(idx, 1)
      texts.splice(next, 0, item)
      return { ...prev, texts }
    })
  }

  function dupText(id: string) {
    commit((prev) => {
      const layer = prev.texts.find((t) => t.id === id)
      if (!layer) return prev
      const copy = duplicateText(layer)
      return {
        ...prev,
        texts: [...prev.texts, copy],
        selected: { type: 'text', id: copy.id },
      }
    })
  }

  function select(selected: SelectedTarget) {
    replace((prev) => ({
      ...prev,
      selected,
      activeTab:
        selected?.type === 'shape'
          ? 'shapes'
          : selected?.type === 'text'
            ? 'text'
            : prev.activeTab,
    }))
  }

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      const stamp = new Date().toISOString().slice(0, 10)
      const name =
        state.kind === 'thumbnail'
          ? `thumbnail-${stamp}.png`
          : `banner-${stamp}.png`
      await exportPng(preset, state, name)
    } catch (err) {
      setExportError(
        err instanceof Error ? te(err.message) : t('export.failedGeneric'),
      )
    } finally {
      setExporting(false)
    }
  }

  const handleSave = useCallback(() => {
    setSaveError(null)
    try {
      const saved = saveProject({
        id: projectId ?? undefined,
        name: projectName,
        kind: state.kind,
        ownerId: session?.userId ?? null,
        state,
      })
      setProjectId(saved.id)
      setProjectName(saved.name)
      setSaveStatus(
        `${t('editor.saved')} · ${new Date(saved.updatedAt).toLocaleTimeString(
          locale === 'hu' ? 'hu-HU' : 'en-US',
        )}`,
      )
    } catch (err) {
      setSaveError(
        err instanceof Error ? te(err.message) : t('editor.saveFailed'),
      )
    }
  }, [projectId, projectName, session?.userId, state, t, te, locale])

  function handleLoad(project: SavedProject) {
    resetHistory({
      ...project.state,
      kind: project.kind,
      presetId: project.kind === 'thumbnail' ? 'yt-thumb' : 'yt-banner',
      selected: null,
      activeTab: 'files',
    })
    setProjectId(project.id)
    setProjectName(project.name)
    setSaveStatus(`${t('editor.loaded')} · ${project.name}`)
    setSaveError(null)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      const mod = e.metaKey || e.ctrlKey
      const current = stateRef.current

      if (mod && e.key === '/') {
        e.preventDefault()
        setHelpOpen((v) => !v)
        return
      }

      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }
      if (
        (mod && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        (mod && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault()
        redo()
        return
      }
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault()
        handleSave()
        return
      }
      if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        void (async () => {
          setExporting(true)
          setExportError(null)
          try {
            const p = getPreset(current.presetId)
            const stamp = new Date().toISOString().slice(0, 10)
            const name =
              current.kind === 'thumbnail'
                ? `thumbnail-${stamp}.png`
                : `banner-${stamp}.png`
            await exportPng(p, current, name)
          } catch (err) {
            setExportError(
              err instanceof Error
                ? te(err.message)
                : t('export.failedGeneric'),
            )
          } finally {
            setExporting(false)
          }
        })()
        return
      }

      if (typing) return

      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        if (current.selected?.type === 'shape') dupShape(current.selected.id)
        if (current.selected?.type === 'text') dupText(current.selected.id)
        return
      }
      if (e.key === 'Escape') {
        select(null)
        return
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        if (current.selected?.type === 'shape') {
          removeShape(current.selected.id)
        }
        if (current.selected?.type === 'text') {
          removeText(current.selected.id)
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave, undo, redo])

  return (
    <div className="editor">
      <header className="editor-top">
        <button type="button" className="back" onClick={onBack}>
          {t('common.back')}
        </button>
        <div className="editor-brand">
          <span className="logo-mark small" aria-hidden />
          <span>Framekit</span>
          <span className="kind-pill">
            {state.kind === 'thumbnail' ? 'Thumbnail' : 'Banner'}
          </span>
        </div>
        <div className="editor-actions">
          <button
            type="button"
            className="header-btn"
            onClick={openSettings}
          >
            {t('common.settings')}
          </button>
          <button type="button" className="header-btn" onClick={undo} title="⌘Z">
            {t('common.undo')}
          </button>
          <button type="button" className="header-btn" onClick={redo} title="⌘⇧Z">
            {t('common.redo')}
          </button>
          <button
            type="button"
            className="header-btn"
            onClick={handleSave}
            title="⌘S"
          >
            {t('common.save')}
          </button>
          <button
            type="button"
            className="header-btn"
            onClick={() => setHelpOpen(true)}
            title="⌘/"
          >
            ?
          </button>
          {session ? (
            <button
              type="button"
              className="header-btn header-btn-accent"
              onClick={() => {
                if (confirm(t('auth.confirmLogout'))) onSession(null)
              }}
            >
              {session.displayName}
            </button>
          ) : (
            <button
              type="button"
              className="header-btn header-btn-accent"
              onClick={() => setAuthOpen(true)}
            >
              {t('common.profile')}
            </button>
          )}
        </div>
      </header>

      <div className={panelOpen ? 'editor-body' : 'editor-body panel-collapsed'}>
        <CanvasPreview
          state={state}
          onSelect={select}
          onMoveShape={(id, x, y) => updateShape(id, { x, y }, true)}
          onResizeShape={(id, patch) => updateShape(id, patch, true)}
          onMoveText={(id, x, y) => updateText(id, { x, y }, true)}
          onGestureStart={beginGesture}
          onGestureEnd={endGesture}
        />
        {panelOpen ? (
          <Controls
            state={state}
            onChange={patch}
            onApplyTemplate={applyTemplate}
            onUpdateShape={(id, p) => updateShape(id, p)}
            onRemoveShape={removeShape}
            onReorderShape={reorderShape}
            onDuplicateShape={dupShape}
            onUpdateText={(id, p) => updateText(id, p)}
            onRemoveText={removeText}
            onReorderText={reorderText}
            onDuplicateText={dupText}
            onAlignShape={alignShape}
            onExport={handleExport}
            exporting={exporting}
            exportError={exportError}
            session={session}
            projectId={projectId}
            projectName={projectName}
            onProjectNameChange={setProjectName}
            onSaveProject={handleSave}
            onLoadProject={handleLoad}
            onAskAuth={() => setAuthOpen(true)}
            saveStatus={saveStatus}
            saveError={saveError}
            onHidePanel={() => setPanel(false)}
          />
        ) : (
          <button
            type="button"
            className="panel-reopen"
            onClick={() => setPanel(true)}
          >
            {t('editor.showPanel')}
          </button>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={onSession}
      />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
