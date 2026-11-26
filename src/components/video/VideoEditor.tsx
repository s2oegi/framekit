import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useVideoHistory } from '../../hooks/useVideoHistory'
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
  emptyVideoProject,
  nextVideoId,
  type VideoClip,
  type VideoProject,
  type VideoSource,
} from '../../video/types'
import { useI18n } from '../../i18n/I18nContext'
import { useSettings } from '../../settings/SettingsContext'
import { VideoPreview } from './VideoPreview'
import { VideoTimeline } from './VideoTimeline'
import { VideoToolbar } from './VideoToolbar'

type Props = {
  onBack: () => void
}

function loadVideoMeta(
  file: File,
): Promise<{ objectUrl: string; duration: number }> {
  const objectUrl = URL.createObjectURL(file)
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      resolve({
        objectUrl,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
      })
    }
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('video.loadError'))
    }
    video.src = objectUrl
  })
}

export function VideoEditor({ onBack }: Props) {
  const { t, te } = useI18n()
  const { openSettings } = useSettings()
  const [project, setProject] = useState<VideoProject>(() => emptyVideoProject())
  const fileRef = useRef<HTMLInputElement>(null)
  const projectRef = useRef(project)
  const { commit, undo, redo, canUndo, canRedo } = useVideoHistory(setProject)

  useEffect(() => {
    projectRef.current = project
  }, [project])

  const setPlayhead = useCallback((t: number, opts?: { snap?: boolean }) => {
    setProject((prev) => {
      const shouldSnap = opts?.snap ?? (!prev.isPlaying && prev.snap)
      const snapped = snapTime(
        t,
        prev.clips,
        shouldSnap,
        0.12,
        [prev.markIn ?? -1, prev.markOut ?? -1].filter((n) => n >= 0),
      )
      const total = totalDuration(prev.clips)
      const playhead = Math.max(0, Math.min(snapped, total || 0))
      if (Math.abs(playhead - prev.playhead) < 0.0005) return prev
      return { ...prev, playhead }
    })
  }, [])

  const stopPlayback = useCallback(() => {
    setProject((prev) =>
      prev.isPlaying ? { ...prev, isPlaying: false } : prev,
    )
  }, [])

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    try {
      const loaded: VideoSource[] = []
      for (const file of files) {
        const { objectUrl, duration } = await loadVideoMeta(file)
        loaded.push({
          id: nextVideoId('src'),
          name: file.name,
          objectUrl,
          duration,
        })
      }

      commit((prev) => {
        const empty = prev.clips.length === 0
        if (empty) {
          for (const s of prev.sources) URL.revokeObjectURL(s.objectUrl)
          const clips = loaded.map((s) => makeClipFromSource(s))
          return {
            ...prev,
            sources: loaded,
            clips,
            selectedClipId: clips[0]?.id ?? null,
            playhead: 0,
            isPlaying: false,
            markIn: null,
            markOut: null,
          }
        }

        let clips = prev.clips
        const sources = [...prev.sources, ...loaded]
        let selectedId: string | null = prev.selectedClipId
        loaded.forEach((src, i) => {
          const clip = makeClipFromSource(src)
          if (i === 0) {
            selectedId = clip.id
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
          selectedClipId: selectedId,
          isPlaying: false,
        }
      })
    } catch (err) {
      alert(
        err instanceof Error ? te(err.message) : t('video.loadFailed'),
      )
    }
    e.target.value = ''
  }

  const togglePlay = useCallback(() => {
    setProject((prev) => {
      if (!prev.clips.length) return prev
      const total = totalDuration(prev.clips)
      if (!prev.isPlaying && prev.playhead >= total - 0.05) {
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
        selectedClipId: hit?.clip.id ?? prev.selectedClipId,
        isPlaying: false,
      }
    })
  }, [commit])

  const handleDelete = useCallback(() => {
    commit((prev) => {
      if (!prev.selectedClipId) return prev
      return rippleDeleteClip(prev, prev.selectedClipId)
    })
  }, [commit])

  const handleDuplicate = useCallback(() => {
    commit((prev) => {
      if (!prev.selectedClipId) return prev
      const next = duplicateClip(
        prev.clips,
        prev.selectedClipId,
        nextVideoId('clip'),
      )
      if (!next) return prev
      const idx = next.findIndex((c) => c.id === prev.selectedClipId)
      return {
        ...prev,
        clips: next,
        selectedClipId: next[idx + 1]?.id ?? prev.selectedClipId,
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
      if (!prev.selectedClipId) return prev
      const clips = moveClip(prev.clips, prev.selectedClipId, dir)
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

  const toggleMuteSelected = useCallback(() => {
    setProject((prev) => {
      if (!prev.selectedClipId) return prev
      const clip = prev.clips.find((c) => c.id === prev.selectedClipId)
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
        sources: pruneSources(prev.sources, nextClips, false),
        playhead: Math.min(marks.from, totalDuration(nextClips)),
        selectedClipId: nextClips[0]?.id ?? null,
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
        sources: pruneSources(prev.sources, nextClips, false),
        playhead: 0,
        selectedClipId: nextClips[0]?.id ?? null,
        markIn: null,
        markOut: null,
        isPlaying: false,
      }
    })
  }, [commit])

  const stepPlayhead = useCallback((delta: number) => {
    setProject((prev) => {
      const total = totalDuration(prev.clips)
      const playhead = Math.max(0, Math.min(prev.playhead + delta, total || 0))
      return {
        ...prev,
        isPlaying: false,
        playhead,
      }
    })
  }, [])

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
        setPlayhead(totalDuration(projectRef.current.clips), { snap: false })
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
        projectRef.current.selectedClipId
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
  ])

  useEffect(() => {
    return () => {
      for (const s of projectRef.current.sources) {
        URL.revokeObjectURL(s.objectUrl)
      }
    }
  }, [])

  const basePx =
    totalDuration(project.clips) > 120
      ? 8
      : totalDuration(project.clips) > 60
        ? 12
        : 24
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
            onClick={openSettings}
          >
            {t('common.settings')}
          </button>
          <span className="field-note">{t('video.betaNote')}</span>
        </div>
      </header>

      <div className="video-editor-body">
        <VideoToolbar
          fileRef={fileRef}
          hasClips={project.clips.length > 0}
          isPlaying={project.isPlaying}
          canSplit={canSplit}
          hasSelection={Boolean(project.selectedClipId)}
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
          onPlayhead={(t) => setPlayhead(t, { snap: false })}
          onEndedTimeline={stopPlayback}
        />

        <VideoTimeline
          project={project}
          pxPerSec={pxPerSec}
          onSelectClip={(id) =>
            setProject((prev) =>
              prev.selectedClipId === id
                ? prev
                : { ...prev, selectedClipId: id },
            )
          }
          onPlayhead={(t) => {
            stopPlayback()
            setPlayhead(t, { snap: true })
          }}
          onTrimClip={handleTrim}
          onSlipClip={handleSlip}
          onRollEdit={handleRoll}
          onPatchClip={handlePatchClip}
        />
      </div>
    </div>
  )
}
