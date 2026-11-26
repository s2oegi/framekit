import {
  clipDuration,
  type TransitionType,
  type VideoClip,
  type VideoProject,
} from './types'

export type LaidOutClip = {
  clip: VideoClip
  index: number
  start: number
  end: number
  /** Overlap into the next clip (0 if none) */
  overlapOut: number
}

export type MixLayer = {
  clip: VideoClip
  index: number
  sourceTime: number
  opacity: number
  volume: number
  /** 0–1 wipe progress when transition is wipe */
  wipe: number | null
}

export type MixState = {
  layers: MixLayer[]
  /** Extra black overlay 0–1 (fade-black) */
  black: number
  layout: LaidOutClip[]
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function easeInOut(t: number) {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

export function effectiveOverlap(left: VideoClip, right: VideoClip) {
  if (left.transition.type === 'none' || left.transition.duration <= 0) {
    return 0
  }
  const max =
    Math.min(clipDuration(left), clipDuration(right)) * 0.45
  return Math.max(0, Math.min(left.transition.duration, max))
}

/** Place clips on a magnetic timeline; outgoing transitions overlap the next clip. */
export function layoutClips(clips: VideoClip[]): LaidOutClip[] {
  const result: LaidOutClip[] = []
  let cursor = 0
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i]
    const dur = clipDuration(clip)
    const start = cursor
    const end = start + dur
    const overlapOut =
      i < clips.length - 1 ? effectiveOverlap(clip, clips[i + 1]) : 0
    result.push({ clip, index: i, start, end, overlapOut })
    cursor = end - overlapOut
  }
  return result
}

export function mixTotalDuration(clips: VideoClip[]) {
  const layout = layoutClips(clips)
  if (!layout.length) return 0
  return layout[layout.length - 1].end
}

function audioEnvelope(
  clip: VideoClip,
  offsetInClip: number,
  dur: number,
): number {
  if (clip.muted) return 0
  let gain = clip.volume
  const fi = Math.min(clip.fadeIn, dur / 2)
  const fo = Math.min(clip.fadeOut, dur / 2)
  if (fi > 0 && offsetInClip < fi) {
    gain *= easeInOut(offsetInClip / fi)
  }
  if (fo > 0 && offsetInClip > dur - fo) {
    gain *= easeInOut((dur - offsetInClip) / fo)
  }
  return Math.max(0, gain)
}

function transitionProgress(
  type: TransitionType,
  p: number,
): { opacityA: number; opacityB: number; black: number; wipe: number | null } {
  const t = easeInOut(p)
  switch (type) {
    case 'crossfade':
      return { opacityA: 1 - t, opacityB: t, black: 0, wipe: null }
    case 'dissolve':
      return {
        opacityA: 1 - t,
        opacityB: t * 0.92 + 0.08,
        black: t * (1 - t) * 0.35,
        wipe: null,
      }
    case 'fade-black':
      if (p < 0.5) {
        return {
          opacityA: 1 - easeInOut(p * 2),
          opacityB: 0,
          black: easeInOut(p * 2),
          wipe: null,
        }
      }
      return {
        opacityA: 0,
        opacityB: easeInOut((p - 0.5) * 2),
        black: 1 - easeInOut((p - 0.5) * 2),
        wipe: null,
      }
    case 'wipe-left':
      return { opacityA: 1, opacityB: 1, black: 0, wipe: t }
    case 'none':
    default:
      return { opacityA: 1, opacityB: 0, black: 0, wipe: null }
  }
}

/**
 * Resolve which clip layer(s) to show at a timeline playhead,
 * including opacity / volume for transitions and fades.
 */
export function resolveMix(
  project: VideoProject,
  playhead: number,
): MixState {
  const layout = layoutClips(project.clips)
  if (!layout.length) {
    return { layers: [], black: 0, layout }
  }

  const total = layout[layout.length - 1].end
  const t = Math.max(0, Math.min(playhead, total))
  const master = project.masterVolume

  // Prefer the latest clip whose range covers t (handles overlaps)
  let primary: LaidOutClip = layout[layout.length - 1]
  for (let i = layout.length - 1; i >= 0; i--) {
    const item = layout[i]
    if (t >= item.start && t <= item.end + 0.0001) {
      primary = item
      break
    }
  }

  const prev = primary.index > 0 ? layout[primary.index - 1] : null
  const inOverlap = Boolean(
    prev &&
      prev.overlapOut > 0 &&
      t >= primary.start &&
      t < prev.end,
  )

  if (inOverlap && prev) {
    const overlap = prev.overlapOut
    const p = clamp01((t - primary.start) / overlap)
    const type = prev.clip.transition.type
    const curves = transitionProgress(type, p)

    const offsetA = t - prev.start
    const offsetB = t - primary.start
    const sourceA = prev.clip.inPoint + offsetA
    const sourceB = primary.clip.inPoint + offsetB

    // Audio follows the same blend as picture (wipe uses linear crossfade)
    const audioA = type === 'wipe-left' ? 1 - p : curves.opacityA
    const audioB = type === 'wipe-left' ? p : curves.opacityB

    const volA =
      audioEnvelope(prev.clip, offsetA, clipDuration(prev.clip)) *
      master *
      audioA
    const volB =
      audioEnvelope(primary.clip, offsetB, clipDuration(primary.clip)) *
      master *
      audioB

    const layers: MixLayer[] = [
      {
        clip: prev.clip,
        index: prev.index,
        sourceTime: sourceA,
        opacity: curves.opacityA,
        volume: volA,
        wipe: curves.wipe,
      },
      {
        clip: primary.clip,
        index: primary.index,
        sourceTime: sourceB,
        opacity: type === 'wipe-left' ? 1 : curves.opacityB,
        volume: volB,
        wipe: curves.wipe,
      },
    ]
    return { layers, black: curves.black, layout }
  }

  const offset = t - primary.start
  const dur = clipDuration(primary.clip)
  const vol =
    audioEnvelope(primary.clip, offset, dur) * master

  return {
    layers: [
      {
        clip: primary.clip,
        index: primary.index,
        sourceTime: primary.clip.inPoint + offset,
        opacity: 1,
        volume: vol,
        wipe: null,
      },
    ],
    black: 0,
    layout,
  }
}

export function clipStartOnMixTimeline(clips: VideoClip[], clipId: string) {
  const layout = layoutClips(clips)
  return layout.find((l) => l.clip.id === clipId)?.start ?? 0
}

export function transitionShortKey(type: TransitionType) {
  switch (type) {
    case 'crossfade':
      return 'video.transShort.crossfade' as const
    case 'fade-black':
      return 'video.transShort.fadeBlack' as const
    case 'dissolve':
      return 'video.transShort.dissolve' as const
    case 'wipe-left':
      return 'video.transShort.wipe' as const
    default:
      return null
  }
}

export function peakMeterFromMix(mix: MixState): number {
  return clamp01(
    mix.layers.reduce((m, l) => Math.max(m, l.volume), 0),
  )
}

