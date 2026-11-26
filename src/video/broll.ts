import { totalDuration } from './timeline'
import {
  clipDuration,
  type BrollClip,
  type VideoProject,
  type VideoSource,
  type VideoTextOverlay,
} from './types'

export type ResolvedBroll = {
  clip: BrollClip
  sourceTime: number
  opacity: number
  volume: number
}

export function brollEnd(clip: BrollClip) {
  return clip.timelineStart + clipDuration(clip)
}

/** Main track + B-roll + text span for scrubbing / playhead clamp */
export function projectSpan(project: VideoProject) {
  let max = totalDuration(project.clips)
  for (const b of project.broll) max = Math.max(max, brollEnd(b))
  for (const tx of project.texts) max = Math.max(max, tx.end)
  return Math.max(0, max)
}

export function resolveBroll(
  project: VideoProject,
  playhead: number,
): ResolvedBroll | null {
  let hit: BrollClip | null = null
  for (const clip of project.broll) {
    const end = brollEnd(clip)
    if (playhead >= clip.timelineStart && playhead < end - 0.0001) {
      if (!hit || clip.timelineStart >= hit.timelineStart) hit = clip
    }
  }
  if (!hit) return null
  const offset = playhead - hit.timelineStart
  const sourceTime = hit.inPoint + offset
  const volume = hit.muted ? 0 : hit.volume * project.masterVolume
  return {
    clip: hit,
    sourceTime,
    opacity: hit.opacity,
    volume,
  }
}

export function activeTexts(
  texts: VideoTextOverlay[],
  playhead: number,
): VideoTextOverlay[] {
  return texts.filter((tx) => playhead >= tx.start && playhead < tx.end)
}

export function patchBroll(
  list: BrollClip[],
  id: string,
  patch: Partial<BrollClip>,
): BrollClip[] {
  return list.map((c) => (c.id === id ? { ...c, ...patch } : c))
}

export function trimBroll(
  clip: BrollClip,
  patch: { inPoint?: number; outPoint?: number; timelineStart?: number },
  sourceDuration: number,
): BrollClip {
  let inPoint = patch.inPoint ?? clip.inPoint
  let outPoint = patch.outPoint ?? clip.outPoint
  inPoint = Math.max(0, Math.min(inPoint, sourceDuration - 0.1))
  outPoint = Math.max(inPoint + 0.1, Math.min(outPoint, sourceDuration))
  const timelineStart = Math.max(0, patch.timelineStart ?? clip.timelineStart)
  return { ...clip, inPoint, outPoint, timelineStart }
}

export function pruneSourcesWithOverlays(
  sources: VideoSource[],
  clips: { sourceId: string }[],
  broll: { sourceId: string }[],
  revoke = true,
): VideoSource[] {
  const used = new Set([
    ...clips.map((c) => c.sourceId),
    ...broll.map((c) => c.sourceId),
  ])
  return sources.filter((s) => {
    if (used.has(s.id)) return true
    if (revoke) URL.revokeObjectURL(s.objectUrl)
    return false
  })
}
