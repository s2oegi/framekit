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

export type VideoProject = {
  sources: VideoSource[]
  clips: VideoClip[]
  selectedClipId: string | null
  playhead: number
  isPlaying: boolean
  markIn: number | null
  markOut: number | null
  snap: boolean
  zoom: number
  masterVolume: number
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

export function clipDuration(clip: VideoClip) {
  return Math.max(0, clip.outPoint - clip.inPoint)
}

export function emptyVideoProject(): VideoProject {
  return {
    sources: [],
    clips: [],
    selectedClipId: null,
    playhead: 0,
    isPlaying: false,
    markIn: null,
    markOut: null,
    snap: true,
    zoom: 1,
    masterVolume: 1,
  }
}

let seq = 0
export function nextVideoId(prefix: string) {
  seq += 1
  return `${prefix}-${Date.now()}-${seq}`
}
