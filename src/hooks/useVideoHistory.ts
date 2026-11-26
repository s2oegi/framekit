import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { VideoClip, VideoProject } from '../video/types'

type Snapshot = {
  clips: VideoClip[]
  selectedClipId: string | null
  markIn: number | null
  markOut: number | null
  playhead: number
}

const MAX = 40

function takeSnapshot(project: VideoProject): Snapshot {
  return {
    clips: project.clips.map((c) => ({
      ...c,
      transition: { ...c.transition },
    })),
    selectedClipId: project.selectedClipId,
    markIn: project.markIn,
    markOut: project.markOut,
    playhead: project.playhead,
  }
}

function applySnapshot(project: VideoProject, snap: Snapshot): VideoProject {
  return {
    ...project,
    clips: snap.clips,
    selectedClipId: snap.selectedClipId,
    markIn: snap.markIn,
    markOut: snap.markOut,
    playhead: snap.playhead,
    isPlaying: false,
  }
}

export function useVideoHistory(
  setProject: Dispatch<SetStateAction<VideoProject>>,
) {
  const past = useRef<Snapshot[]>([])
  const future = useRef<Snapshot[]>([])
  const [version, setVersion] = useState(0)

  const bump = useCallback(() => {
    queueMicrotask(() => setVersion((v) => v + 1))
  }, [])

  const commit = useCallback(
    (recipe: (prev: VideoProject) => VideoProject) => {
      setProject((prev) => {
        const next = recipe(prev)
        if (next === prev) return prev
        past.current = [...past.current, takeSnapshot(prev)].slice(-MAX)
        future.current = []
        bump()
        return next
      })
    },
    [setProject, bump],
  )

  const undo = useCallback(() => {
    setProject((prev) => {
      const snap = past.current.pop()
      if (!snap) return prev
      future.current.push(takeSnapshot(prev))
      bump()
      return applySnapshot(prev, snap)
    })
  }, [setProject, bump])

  const redo = useCallback(() => {
    setProject((prev) => {
      const snap = future.current.pop()
      if (!snap) return prev
      past.current.push(takeSnapshot(prev))
      bump()
      return applySnapshot(prev, snap)
    })
  }, [setProject, bump])

  return {
    commit,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    version,
  }
}
