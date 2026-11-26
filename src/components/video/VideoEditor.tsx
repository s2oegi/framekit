import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useVideoHistory } from '../../hooks/useVideoHistory'
import {
  loadVideoProject,
  saveVideoProject,
} from '../../lib/videoProjectStore'
import {
  patchBroll,
  projectSpan,
  pruneSourcesWithOverlays,
  trimBroll,
} from '../../video/broll'
import {
  duplicateClip,
  extractRange,
  findClipAtPlayhead,
  FRAME,
  insertClipAtPlayhead,
  isolateRange,
  makeClipFromSource,
  MIN_CLIP,
  moveClip,
  normalizedMarks,
  patchClip,
  pruneSources,
  rippleDeleteClip,
  rollEdit,
  slipClip,
  snapTime,
  splitClipAtPlayhead,
  totalDuration,
  trimClip,
} from '../../video/timeline'
import {
  createBrollFromSource,
  createTextOverlay,
  emptyVideoProject,
  nextVideoId,
  selectedClipId,
  type BrollClip,
  type VideoClip,
  type VideoProject,
  type VideoSelection,
  type VideoSource,
  type VideoTextOverlay,
} from '../../video/types'
import { useI18n } from '../../i18n/I18nContext'
import { useSettings } from '../../settings/SettingsContext'
import { VideoMediaPanel } from './VideoMediaPanel'
import { VideoPreview } from './VideoPreview'
import { VideoProjectsPanel } from './VideoProjectsPanel'
import { VideoTimeline } from './VideoTimeline'
import { VideoToolbar } from './VideoToolbar'

type Props = {
  onBack: () => void
}

function loadVideoMeta(
  file: File,
): Promise<{ objectUrl: string; duration: number; blob: Blob }> {
  const blob: Blob = file
  const objectUrl = URL.createObjectURL(blob)
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      resolve({
        objectUrl,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        blob,
      })
    }
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('video.loadError'))
    }
    video.src = objectUrl
  })
}

function revokeAll(sources: VideoSource[]) {
  for (const s of sources) URL.revokeObjectURL(s.objectUrl)
}

export function VideoEditor({ onBack }: Props) {
  const { t, te } = useI18n()
  const { openSettings } = useSettings()
  const [project, setProject] = useState<VideoProject>(() => emptyVideoProject())
  const [sideTab, setSideTab] = useState<'media' | 'projects'>('media')
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [listKey, setListKey] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const projectRef = useRef(project)
  const { commit, undo, redo, resetHistory, canUndo, canRedo } =
    useVideoHistory(setProject)

  useEffect(() => {
    projectRef.current = project
  }, [project])

  const setPlayhead = useCallback((time: number, opts?: { snap?: boolean }) => {
    setProject((prev) => {
      const shouldSnap = opts?.snap ?? (!prev.isPlaying && prev.snap)
      const span = projectSpan(prev)
      const snapped = snapTime(
        time,
        prev.clips,
        shouldSnap,
        0.12,
        [prev.markIn ?? -1, prev.markOut ?? -1].filter((n) => n >= 0),
      )
      const playhead = Math.max(0, Math.min(snapped, span || 0))
      if (Math.abs(playhead - prev.playhead) < 0.0005) return prev
      return { ...prev, playhead }
    })
  }, [])

  const stopPlayback = useCallback(() => {
    setProject((prev) =>
      prev.isPlaying ? { ...prev, isPlaying: false } : prev,
    )
  }, [])

  const setSelection = useCallback((selected: VideoSelection) => {
    setProject((prev) => {
      const same =
        (prev.selected == null && selected == null) ||
        (prev.selected?.type === selected?.type &&
          prev.selected?.id === selected?.id)
      return same ? prev : { ...prev, selected }
    })
  }, [])

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    try {
      const loaded: VideoSource[] = []
      for (const file of files) {
        const { objectUrl, duration, blob } = await loadVideoMeta(file)
        loaded.push({
          id: nextVideoId('src'),
          name: file.name,
          objectUrl,
          duration,
          blob,
        })
      }

      commit((prev) => {
        const empty = prev.clips.length === 0
        if (empty) {
          revokeAll(prev.sources)
          const clips = loaded.map((s) => makeClipFromSource(s))
          return {
            ...prev,
            sources: loaded,
            clips,
            broll: [],
            texts: [],
            selected: clips[0] ? { type: 'clip', id: clips[0].id } : null,
            playhead: 0,
            isPlaying: false,
            markIn: null,
            markOut: null,
          }
        }

        let clips = prev.clips
        const sources = [...prev.sources, ...loaded]
        let selected: VideoSelection = prev.selected
        loaded.forEach((src, i) => {
          const clip = makeClipFromSource(src)
          if (i === 0) {
            selected = { type: 'clip', id: clip.id }
            clips = insertClipAtPlayhead(
              clips,
              prev.playhead,
              clip,
              nextVideoId('clip'),
            )
          } else {
            clips = [...clips, clip]
          }
        })
        return {
          ...prev,
          sources,
          clips,
          selected,
          isPlaying: false,
        }
      })
      setSideTab('media')
    } catch (err) {
      alert(err instanceof Error ? te(err.message) : t('video.loadFailed'))
    }
    e.target.value = ''
  }

  const togglePlay = useCallback(() => {
    setProject((prev) => {
      const span = projectSpan(prev)
      if (span <= 0) return prev
      if (!prev.isPlaying && prev.playhead >= span - 0.05) {
        return { ...prev, playhead: 0, isPlaying: true }
      }
      return { ...prev, isPlaying: !prev.isPlaying }
    })
  }, [])

  const handleSplit = useCallback(() => {
    commit((prev) => {
      const nextClips = splitClipAtPlayhead(
        prev.clips,
        prev.playhead,
        nextVideoId('clip'),
      )
      if (!nextClips) return prev
      const hit = findClipAtPlayhead(nextClips, prev.playhead)
      return {
        ...prev,
        clips: nextClips,
        selected: hit
          ? { type: 'clip', id: hit.clip.id }
          : prev.selected,
        isPlaying: false,
      }
    })
  }, [commit])

  const handleDelete = useCallback(() => {
    commit((prev) => {
      const sel = prev.selected
      if (!sel) return prev
      if (sel.type === 'clip') return rippleDeleteClip(prev, sel.id)
      if (sel.type === 'broll') {
        const broll = prev.broll.filter((c) => c.id !== sel.id)
        return {
          ...prev,
          broll,
          sources: pruneSourcesWithOverlays(
            prev.sources,
            prev.clips,
            broll,
            false,
          ),
          selected: null,
          isPlaying: false,
        }
      }
      return {
        ...prev,
        texts: prev.texts.filter((tx) => tx.id !== sel.id),
        selected: null,
        isPlaying: false,
      }
    })
  }, [commit])

  const handleDuplicate = useCallback(() => {
    commit((prev) => {
      const id = selectedClipId(prev)
      if (!id) return prev
      const next = duplicateClip(prev.clips, id, nextVideoId('clip'))
      if (!next) return prev
      const idx = next.findIndex((c) => c.id === id)
      const newId = next[idx + 1]?.id
      return {
        ...prev,
        clips: next,
        selected: newId ? { type: 'clip', id: newId } : prev.selected,
        isPlaying: false,
      }
    })
  }, [commit])

  function handleTrim(
    clipId: string,
    patch: { inPoint?: number; outPoint?: number },
  ) {
    setProject((prev) => {
      const clip = prev.clips.find((c) => c.id === clipId)
      if (!clip) return prev
      const source = prev.sources.find((s) => s.id === clip.sourceId)
      if (!source) return prev
      const next = trimClip(clip, patch, source.duration)
      if (next.inPoint === clip.inPoint && next.outPoint === clip.outPoint) {
        return prev
      }
      return {
        ...prev,
        clips: prev.clips.map((c) => (c.id === clipId ? next : c)),
        isPlaying: false,
      }
    })
  }

  function handleSlip(clipId: string, deltaSec: number) {
    if (Math.abs(deltaSec) < 0.0001) return
    setProject((prev) => {
      const clip = prev.clips.find((c) => c.id === clipId)
      if (!clip) return prev
      const source = prev.sources.find((s) => s.id === clip.sourceId)
      if (!source) return prev
      return {
        ...prev,
        clips: prev.clips.map((c) =>
          c.id === clipId ? slipClip(c, deltaSec, source.duration) : c,
        ),
        isPlaying: false,
      }
    })
  }

  function handleRoll(leftIndex: number, deltaSec: number) {
    setProject((prev) => {
      const left = prev.clips[leftIndex]
      const right = prev.clips[leftIndex + 1]
      if (!left || !right) return prev
      const ls = prev.sources.find((s) => s.id === left.sourceId)
      const rs = prev.sources.find((s) => s.id === right.sourceId)
      if (!ls || !rs) return prev
      const next = rollEdit(
        prev.clips,
        leftIndex,
        deltaSec,
        ls.duration,
        rs.duration,
      )
      if (!next) return prev
      return { ...prev, clips: next, isPlaying: false }
    })
  }

  function handleMove(dir: -1 | 1) {
    commit((prev) => {
      const id = selectedClipId(prev)
      if (!id) return prev
      const clips = moveClip(prev.clips, id, dir)
      if (clips === prev.clips) return prev
      return { ...prev, clips, isPlaying: false }
    })
  }

  function handlePatchClip(clipId: string, patch: Partial<VideoClip>) {
    const structural = Boolean(patch.transition)
    const apply = (prev: VideoProject) => {
      const clips = patchClip(prev.clips, clipId, patch)
      return {
        ...prev,
        clips,
        isPlaying: structural ? false : prev.isPlaying,
      }
    }
    if (structural) commit(apply)
    else setProject(apply)
  }

  function handlePatchBroll(id: string, patch: Partial<BrollClip>) {
    setProject((prev) => {
      const clip = prev.broll.find((c) => c.id === id)
      if (!clip) return prev
      const source = prev.sources.find((s) => s.id === clip.sourceId)
      if (!source) return prev
      const next = trimBroll(
        { ...clip, ...patch },
        {
          inPoint: patch.inPoint,
          outPoint: patch.outPoint,
          timelineStart: patch.timelineStart,
        },
        source.duration,
      )
      const merged = {
        ...next,
        opacity: patch.opacity ?? next.opacity,
        volume: patch.volume ?? next.volume,
        muted: patch.muted ?? next.muted,
      }
      return {
        ...prev,
        broll: patchBroll(prev.broll, id, merged),
        isPlaying: false,
      }
    })
  }

  function handlePatchText(id: string, patch: Partial<VideoTextOverlay>) {
    setProject((prev) => ({
      ...prev,
      texts: prev.texts.map((tx) => {
        if (tx.id !== id) return tx
        const next = { ...tx, ...patch }
        if (next.end <= next.start + 0.15) next.end = next.start + 0.15
        return next
      }),
      isPlaying: false,
    }))
  }

  function handleMoveBroll(id: string, timelineStart: number) {
    setProject((prev) => ({
      ...prev,
      broll: patchBroll(prev.broll, id, {
        timelineStart: Math.max(0, timelineStart),
      }),
      isPlaying: false,
    }))
  }

  function handleMoveText(id: string, start: number) {
    setProject((prev) => {
      const tx = prev.texts.find((c) => c.id === id)
      if (!tx) return prev
      const dur = tx.end - tx.start
      const nextStart = Math.max(0, start)
      return {
        ...prev,
        texts: prev.texts.map((c) =>
          c.id === id
            ? { ...c, start: nextStart, end: nextStart + dur }
            : c,
        ),
        isPlaying: false,
      }
    })
  }

  const addText = useCallback(() => {
    commit((prev) => {
      const tx = createTextOverlay(prev.playhead, projectSpan(prev))
      return {
        ...prev,
        texts: [...prev.texts, tx],
        selected: { type: 'text', id: tx.id },
        isPlaying: false,
      }
    })
  }, [commit])

  const addSourceToMain = useCallback(
    (sourceId: string) => {
      commit((prev) => {
        const source = prev.sources.find((s) => s.id === sourceId)
        if (!source) return prev
        const clip = makeClipFromSource(source)
        const clips = insertClipAtPlayhead(
          prev.clips,
          prev.playhead,
          clip,
          nextVideoId('clip'),
        )
        return {
          ...prev,
          clips,
          selected: { type: 'clip', id: clip.id },
          isPlaying: false,
        }
      })
    },
    [commit],
  )

  const addSourceToBroll = useCallback(
    (sourceId: string) => {
      commit((prev) => {
        const source = prev.sources.find((s) => s.id === sourceId)
        if (!source) return prev
        const clip = createBrollFromSource(source, prev.playhead)
        return {
          ...prev,
          broll: [...prev.broll, clip],
          selected: { type: 'broll', id: clip.id },
          isPlaying: false,
        }
      })
    },
    [commit],
  )

  const toggleMuteSelected = useCallback(() => {
    setProject((prev) => {
      const id = selectedClipId(prev)
      if (!id) return prev
      const clip = prev.clips.find((c) => c.id === id)
      if (!clip) return prev
      return {
        ...prev,
        clips: patchClip(prev.clips, clip.id, { muted: !clip.muted }),
      }
    })
  }, [])

  const setMarkIn = useCallback(() => {
    setProject((prev) => ({
      ...prev,
      markIn: prev.playhead,
      isPlaying: false,
    }))
  }, [])

  const setMarkOut = useCallback(() => {
    setProject((prev) => ({
      ...prev,
      markOut: prev.playhead,
      isPlaying: false,
    }))
  }, [])

  const clearMarks = useCallback(() => {
    setProject((prev) =>
      prev.markIn == null && prev.markOut == null
        ? prev
        : { ...prev, markIn: null, markOut: null },
    )
  }, [])

  const handleExtract = useCallback(() => {
    commit((prev) => {
      const marks = normalizedMarks(
        prev.markIn,
        prev.markOut,
        totalDuration(prev.clips),
      )
      if (!marks) return prev
      const nextClips = extractRange(prev.clips, marks.from, marks.to, () =>
        nextVideoId('clip'),
      )
      if (!nextClips) return prev
      return {
        ...prev,
        clips: nextClips,
        sources: pruneSources(prev.sources, nextClips, false, prev.broll),
        playhead: Math.min(marks.from, totalDuration(nextClips)),
        selected: nextClips[0] ? { type: 'clip', id: nextClips[0].id } : null,
        markIn: null,
        markOut: null,
        isPlaying: false,
      }
    })
  }, [commit])

  const handleIsolate = useCallback(() => {
    commit((prev) => {
      const marks = normalizedMarks(
        prev.markIn,
        prev.markOut,
        totalDuration(prev.clips),
      )
      if (!marks) return prev
      const nextClips = isolateRange(prev.clips, marks.from, marks.to, () =>
        nextVideoId('clip'),
      )
      if (!nextClips) return prev
      return {
        ...prev,
        clips: nextClips,
        sources: pruneSources(prev.sources, nextClips, false, prev.broll),
        playhead: 0,
        selected: nextClips[0] ? { type: 'clip', id: nextClips[0].id } : null,
        markIn: null,
        markOut: null,
        isPlaying: false,
      }
    })
  }, [commit])

  const stepPlayhead = useCallback((delta: number) => {
    setProject((prev) => {
      const span = projectSpan(prev)
      const playhead = Math.max(0, Math.min(prev.playhead + delta, span || 0))
      return {
        ...prev,
        isPlaying: false,
        playhead,
      }
    })
  }, [])

  async function handleSave() {
    setSaveError(null)
    setSaveStatus(null)
    try {
      if (!project.sources.length) {
        setSaveError(t('video.saveNeedsMedia'))
        return
      }
      const saved = await saveVideoProject(project)
      setProject((prev) => ({
        ...prev,
        projectId: saved.projectId,
        projectName: saved.projectName,
      }))
      setSaveStatus(t('files.saved'))
      setListKey((k) => k + 1)
      setSideTab('projects')
    } catch (err) {
      setSaveError(
        err instanceof Error ? te(err.message) : t('files.saveFailed'),
      )
    }
  }

  async function handleLoad(id: string) {
    setSaveError(null)
    setSaveStatus(null)
    try {
      const loaded = await loadVideoProject(id)
      revokeAll(projectRef.current.sources)
      setProject(loaded)
      resetHistory()
      setSaveStatus(t('video.projectLoaded'))
      setSideTab('projects')
    } catch (err) {
      setSaveError(
        err instanceof Error ? te(err.message) : t('files.loadFailed'),
      )
    }
  }

  const canSplit = (() => {
    const hit = findClipAtPlayhead(project.clips, project.playhead)
    if (!hit) return false
    return (
      hit.offsetInClip >= MIN_CLIP &&
      hit.clip.outPoint - hit.clip.inPoint - hit.offsetInClip >= MIN_CLIP
    )
  })()

  const hasMarks = normalizedMarks(
    project.markIn,
    project.markOut,
    totalDuration(project.clips),
  ) != null

  const hasSelection = Boolean(project.selected)
  const hasClipSelection = selectedClipId(project) != null
  const hasTimeline = projectSpan(project) > 0

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      if (typing) return

      const key = e.key.toLowerCase()
      const mod = e.metaKey || e.ctrlKey

      if (mod && key === 's') {
        e.preventDefault()
        void handleSave()
        return
      }
      if (mod && key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }
      if ((mod && key === 'z' && e.shiftKey) || (mod && key === 'y')) {
        e.preventDefault()
        redo()
        return
      }
      if (e.code === 'Space' || key === 'k') {
        e.preventDefault()
        togglePlay()
        return
      }
      if (key === 'j') {
        e.preventDefault()
        stepPlayhead(-(e.shiftKey ? 1 : FRAME * 5))
        return
      }
      if (key === 'l') {
        e.preventDefault()
        stepPlayhead(e.shiftKey ? 1 : FRAME * 5)
        return
      }
      if (e.key === 'Home') {
        e.preventDefault()
        stopPlayback()
        setPlayhead(0, { snap: false })
        return
      }
      if (e.key === 'End') {
        e.preventDefault()
        stopPlayback()
        setPlayhead(projectSpan(projectRef.current), { snap: false })
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepPlayhead(-(e.shiftKey ? 1 : FRAME))
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepPlayhead(e.shiftKey ? 1 : FRAME)
        return
      }
      if (key === 's' && !mod) {
        e.preventDefault()
        handleSplit()
        return
      }
      if (key === 't' && !mod) {
        e.preventDefault()
        addText()
        return
      }
      if (key === 'd' && !mod) {
        e.preventDefault()
        handleDuplicate()
        return
      }
      if (key === 'm' && !mod) {
        e.preventDefault()
        toggleMuteSelected()
        return
      }
      if (key === 'i') {
        e.preventDefault()
        setMarkIn()
        return
      }
      if (key === 'o') {
        e.preventDefault()
        setMarkOut()
        return
      }
      if (key === 'x') {
        e.preventDefault()
        clearMarks()
        return
      }
      if (key === 'e') {
        e.preventDefault()
        handleExtract()
        return
      }
      if (key === 'u' && !mod) {
        e.preventDefault()
        handleIsolate()
        return
      }
      if (key === '=' || key === '+') {
        e.preventDefault()
        setProject((p) => ({
          ...p,
          zoom: Math.min(4, +(p.zoom + 0.25).toFixed(2)),
        }))
        return
      }
      if (key === '-' || key === '_') {
        e.preventDefault()
        setProject((p) => ({
          ...p,
          zoom: Math.max(0.35, +(p.zoom - 0.25).toFixed(2)),
        }))
        return
      }
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        projectRef.current.selected
      ) {
        e.preventDefault()
        handleDelete()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    togglePlay,
    handleSplit,
    handleDelete,
    handleDuplicate,
    toggleMuteSelected,
    setMarkIn,
    setMarkOut,
    clearMarks,
    handleExtract,
    handleIsolate,
    stepPlayhead,
    undo,
    redo,
    stopPlayback,
    setPlayhead,
    addText,
  ])

  useEffect(() => {
    return () => {
      revokeAll(projectRef.current.sources)
    }
  }, [])

  const span = projectSpan(project)
  const basePx = span > 120 ? 8 : span > 60 ? 12 : 24
  const pxPerSec = basePx * project.zoom

  return (
    <div className="video-editor">
      <header className="editor-top">
        <button type="button" className="back" onClick={onBack}>
          {t('common.back')}
        </button>
        <div className="editor-brand">
          <span className="logo-mark small" aria-hidden />
          <span>Framekit</span>
          <span className="kind-pill">{t('video.pill')}</span>
          <span className="beta-badge">{t('video.beta')}</span>
        </div>
        <div className="editor-actions">
          <button
            type="button"
            className="header-btn"
            onClick={() => void handleSave()}
            title="⌘S"
          >
            {t('common.save')}
          </button>
          <button
            type="button"
            className="header-btn"
            onClick={openSettings}
          >
            {t('common.settings')}
          </button>
          <span className="field-note">{t('video.betaNote')}</span>
        </div>
      </header>

      <div className="video-editor-body video-editor-body-split">
        <aside className="video-side">
          <div className="video-side-tabs">
            <button
              type="button"
              className={sideTab === 'media' ? 'chip chip-active' : 'chip'}
              onClick={() => setSideTab('media')}
            >
              {t('video.media')}
            </button>
            <button
              type="button"
              className={sideTab === 'projects' ? 'chip chip-active' : 'chip'}
              onClick={() => setSideTab('projects')}
            >
              {t('video.projects')}
            </button>
          </div>
          {sideTab === 'media' ? (
            <VideoMediaPanel
              sources={project.sources}
              onAddToMain={addSourceToMain}
              onAddToBroll={addSourceToBroll}
            />
          ) : (
            <VideoProjectsPanel
              projectId={project.projectId}
              projectName={project.projectName}
              onNameChange={(name) =>
                setProject((p) => ({ ...p, projectName: name }))
              }
              onSave={() => void handleSave()}
              onLoad={(id) => void handleLoad(id)}
              status={saveStatus}
              error={saveError}
              refreshKey={listKey}
            />
          )}
        </aside>

        <div className="video-main-col">
          <VideoToolbar
            fileRef={fileRef}
            hasClips={hasTimeline}
            isPlaying={project.isPlaying}
            canSplit={canSplit}
            hasSelection={hasSelection}
            hasClipSelection={hasClipSelection}
            hasMarks={hasMarks}
            snap={project.snap}
            zoom={project.zoom}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
            onImport={onImport}
            onTogglePlay={togglePlay}
            onSplit={handleSplit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onMoveLeft={() => handleMove(-1)}
            onMoveRight={() => handleMove(1)}
            onAddText={addText}
            onSave={() => void handleSave()}
            onMarkIn={setMarkIn}
            onMarkOut={setMarkOut}
            onClearMarks={clearMarks}
            onExtract={handleExtract}
            onIsolate={handleIsolate}
            onToggleSnap={() =>
              setProject((p) => ({ ...p, snap: !p.snap }))
            }
            onZoom={(dir) =>
              setProject((p) => ({
                ...p,
                zoom: Math.max(
                  0.35,
                  Math.min(4, +(p.zoom + dir * 0.25).toFixed(2)),
                ),
              }))
            }
            onStep={stepPlayhead}
            masterVolume={project.masterVolume}
            onMasterVolume={(v) =>
              setProject((p) => ({ ...p, masterVolume: v }))
            }
          />

          <VideoPreview
            project={project}
            onPlayhead={(time) => setPlayhead(time, { snap: false })}
            onEndedTimeline={stopPlayback}
          />

          <VideoTimeline
            project={project}
            pxPerSec={pxPerSec}
            onSelect={(sel) => setSelection(sel)}
            onPlayhead={(time) => {
              stopPlayback()
              setPlayhead(time, { snap: true })
            }}
            onTrimClip={handleTrim}
            onSlipClip={handleSlip}
            onRollEdit={handleRoll}
            onPatchClip={handlePatchClip}
            onPatchBroll={handlePatchBroll}
            onPatchText={handlePatchText}
            onMoveBroll={handleMoveBroll}
            onMoveText={handleMoveText}
            onDeleteBroll={(id) =>
              commit((prev) => ({
                ...prev,
                broll: prev.broll.filter((c) => c.id !== id),
                sources: pruneSourcesWithOverlays(
                  prev.sources,
                  prev.clips,
                  prev.broll.filter((c) => c.id !== id),
                  false,
                ),
                selected:
                  prev.selected?.type === 'broll' && prev.selected.id === id
                    ? null
                    : prev.selected,
                isPlaying: false,
              }))
            }
            onDeleteText={(id) =>
              commit((prev) => ({
                ...prev,
                texts: prev.texts.filter((tx) => tx.id !== id),
                selected:
                  prev.selected?.type === 'text' && prev.selected.id === id
                    ? null
                    : prev.selected,
                isPlaying: false,
              }))
            }
          />
        </div>
      </div>
    </div>
  )
}
