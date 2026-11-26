export type TransitionType =
  | 'none'
  | 'crossfade'
  | 'fade-black'
  | 'dissolve'
  | 'wipe-left'

export type ClipTransition = {
  type: TransitionType
  /** Seconds; clamped against neighboring clip lengths at mix time */
  duration: number
}

export type VideoSource = {
  id: string
  name: string
  objectUrl: string
  duration: number
  /** Kept for IndexedDB save / restore */
  blob: Blob
}

export type VideoClip = {
  id: string
  sourceId: string
  inPoint: number
  outPoint: number
  /** 0–1.5 linear gain */
  volume: number
  muted: boolean
  /** Fade-in length at clip start (seconds) */
  fadeIn: number
  /** Fade-out length at clip end (seconds) */
  fadeOut: number
  /** Outgoing transition into the next clip */
  transition: ClipTransition
}

/** Absolute-timed overlay clip (B-roll) on top of the main track */
export type BrollClip = {
  id: string
  sourceId: string
  timelineStart: number
  inPoint: number
  outPoint: number
  opacity: number
  volume: number
  muted: boolean
}

export type VideoTextOverlay = {
  id: string
  text: string
  start: number
  end: number
  /** 0–100 percent of frame */
  x: number
  y: number
  fontSize: number
  color: string
  align: 'left' | 'center' | 'right'
  font: string
}

export type VideoSelection =
  | { type: 'clip'; id: string }
  | { type: 'broll'; id: string }
  | { type: 'text'; id: string }
  | null

export type VideoProject = {
  sources: VideoSource[]
  clips: VideoClip[]
  broll: BrollClip[]
  texts: VideoTextOverlay[]
  selected: VideoSelection
  playhead: number
  isPlaying: boolean
  markIn: number | null
  markOut: number | null
  snap: boolean
  zoom: number
  masterVolume: number
  /** Local save id when loaded / saved */
  projectId: string | null
  projectName: string
}

export const TRANSITION_OPTIONS: {
  type: TransitionType
  labelKey:
    | 'video.trans.none'
    | 'video.trans.crossfade'
    | 'video.trans.fadeBlack'
    | 'video.trans.dissolve'
    | 'video.trans.wipe'
}[] = [
  { type: 'none', labelKey: 'video.trans.none' },
  { type: 'crossfade', labelKey: 'video.trans.crossfade' },
  { type: 'fade-black', labelKey: 'video.trans.fadeBlack' },
  { type: 'dissolve', labelKey: 'video.trans.dissolve' },
  { type: 'wipe-left', labelKey: 'video.trans.wipe' },
]

export function defaultTransition(): ClipTransition {
  return { type: 'none', duration: 0.5 }
}

export function clipDuration(clip: { inPoint: number; outPoint: number }) {
  return Math.max(0, clip.outPoint - clip.inPoint)
}

export function selectedClipId(project: VideoProject): string | null {
  return project.selected?.type === 'clip' ? project.selected.id : null
}

export function emptyVideoProject(): VideoProject {
  return {
    sources: [],
    clips: [],
    broll: [],
    texts: [],
    selected: null,
    playhead: 0,
    isPlaying: false,
    markIn: null,
    markOut: null,
    snap: true,
    zoom: 1,
    masterVolume: 1,
    projectId: null,
    projectName: 'Untitled video',
  }
}

export function createTextOverlay(
  playhead: number,
  total: number,
): VideoTextOverlay {
  const start = Math.max(0, playhead)
  const end = Math.min(Math.max(start + 3, start + 0.5), Math.max(total, start + 3))
  return {
    id: nextVideoId('text'),
    text: 'Title',
    start,
    end,
    x: 50,
    y: 50,
    fontSize: 64,
    color: '#FFFFFF',
    align: 'center',
    font: 'bebas',
  }
}

export function createBrollFromSource(
  source: VideoSource,
  timelineStart: number,
  maxLen = 4,
): BrollClip {
  const dur = Math.min(maxLen, Math.max(0.5, source.duration))
  return {
    id: nextVideoId('broll'),
    sourceId: source.id,
    timelineStart: Math.max(0, timelineStart),
    inPoint: 0,
    outPoint: dur,
    opacity: 0.85,
    volume: 0,
    muted: true,
  }
}

let seq = 0
export function nextVideoId(prefix: string) {
  seq += 1
  return `${prefix}-${Date.now()}-${seq}`
}
