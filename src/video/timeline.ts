import {
  clipDuration,
  defaultTransition,
  nextVideoId,
  type VideoClip,
  type VideoProject,
  type VideoSource,
} from './types'
import { layoutClips, mixTotalDuration } from './mix'

export type TimelineHit = {
  clip: VideoClip
  index: number
  /** Time within the source media */
  sourceTime: number
  /** Offset from clip start on the timeline */
  offsetInClip: number
}

export const MIN_CLIP = 0.1
export const FRAME = 1 / 30

export function totalDuration(clips: VideoClip[]) {
  return mixTotalDuration(clips)
}

export function findClipAtPlayhead(
  clips: VideoClip[],
  playhead: number,
): TimelineHit | null {
  const layout = layoutClips(clips)
  if (!layout.length) return null
  const total = layout[layout.length - 1].end
  const t = Math.max(0, Math.min(playhead, total))
  let best = layout[layout.length - 1]
  for (let i = layout.length - 1; i >= 0; i--) {
    const item = layout[i]
    if (t >= item.start && t <= item.end + 0.0001) {
      best = item
      break
    }
  }
  const offsetInClip = Math.min(
    Math.max(0, t - best.start),
    clipDuration(best.clip),
  )
  return {
    clip: best.clip,
    index: best.index,
    offsetInClip,
    sourceTime: best.clip.inPoint + offsetInClip,
  }
}

export function clipStartOnTimeline(clips: VideoClip[], clipId: string) {
  return layoutClips(clips).find((l) => l.clip.id === clipId)?.start ?? 0
}

export function getSource(
  project: VideoProject,
  sourceId: string,
): VideoSource | undefined {
  return project.sources.find((s) => s.id === sourceId)
}

export function formatTime(seconds: number, precise = false) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (precise) {
    const cs = Math.floor((seconds % 1) * 100)
    return `${m}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
  }
  const ds = Math.floor((seconds % 1) * 10)
  return `${m}:${s.toString().padStart(2, '0')}.${ds}`
}

/** Edit points (cut / overlap boundaries) on the timeline for snapping. */
export function editPoints(clips: VideoClip[]): number[] {
  const layout = layoutClips(clips)
  const points = new Set<number>([0])
  for (const item of layout) {
    points.add(item.start)
    points.add(item.end)
    if (item.overlapOut > 0) {
      points.add(item.end - item.overlapOut)
    }
  }
  return [...points].sort((a, b) => a - b)
}

export function snapTime(
  t: number,
  clips: VideoClip[],
  enabled: boolean,
  thresholdSec: number,
  extra: number[] = [],
): number {
  if (!enabled) return t
  const points = [...editPoints(clips), ...extra]
  let best = t
  let bestDist = thresholdSec
  for (const p of points) {
    const d = Math.abs(p - t)
    if (d < bestDist) {
      bestDist = d
      best = p
    }
  }
  return best
}

export function trimClip(
  clip: VideoClip,
  patch: { inPoint?: number; outPoint?: number },
  sourceDuration: number,
): VideoClip {
  let inPoint = patch.inPoint ?? clip.inPoint
  let outPoint = patch.outPoint ?? clip.outPoint
  inPoint = Math.max(0, Math.min(inPoint, sourceDuration - MIN_CLIP))
  outPoint = Math.max(inPoint + MIN_CLIP, Math.min(outPoint, sourceDuration))
  if (outPoint - inPoint < MIN_CLIP) {
    outPoint = inPoint + MIN_CLIP
  }
  return { ...clip, inPoint, outPoint }
}

/** Slip: keep timeline duration, slide source window. */
export function slipClip(
  clip: VideoClip,
  deltaSec: number,
  sourceDuration: number,
): VideoClip {
  const dur = clipDuration(clip)
  let inPoint = clip.inPoint + deltaSec
  let outPoint = inPoint + dur
  if (inPoint < 0) {
    inPoint = 0
    outPoint = dur
  }
  if (outPoint > sourceDuration) {
    outPoint = sourceDuration
    inPoint = Math.max(0, outPoint - dur)
  }
  return { ...clip, inPoint, outPoint }
}

/**
 * Roll edit at the cut between clip[index] and clip[index+1]:
 * move the shared cut by delta (timeline seconds), adjusting source outs/ins.
 * Total duration of the pair stays the same.
 */
export function rollEdit(
  clips: VideoClip[],
  leftIndex: number,
  deltaSec: number,
  leftSourceDuration: number,
  rightSourceDuration: number,
): VideoClip[] | null {
  if (leftIndex < 0 || leftIndex >= clips.length - 1) return null
  const left = clips[leftIndex]
  const right = clips[leftIndex + 1]

  const maxGrowLeft = leftSourceDuration - left.outPoint
  const maxShrinkLeft = clipDuration(left) - MIN_CLIP
  const maxGrowRight = right.inPoint
  const maxShrinkRight = clipDuration(right) - MIN_CLIP

  let applied = deltaSec
  applied = Math.min(applied, maxGrowLeft, maxShrinkRight)
  applied = Math.max(applied, -maxShrinkLeft, -maxGrowRight)
  if (right.inPoint + applied < 0) applied = -right.inPoint
  if (right.inPoint + applied > rightSourceDuration - MIN_CLIP) {
    applied = rightSourceDuration - MIN_CLIP - right.inPoint
  }
  if (Math.abs(applied) < 0.0001) return null

  const next = [...clips]
  next[leftIndex] = { ...left, outPoint: left.outPoint + applied }
  next[leftIndex + 1] = { ...right, inPoint: right.inPoint + applied }
  return next
}

export function splitClipAtPlayhead(
  clips: VideoClip[],
  playhead: number,
  newId: string,
): VideoClip[] | null {
  const hit = findClipAtPlayhead(clips, playhead)
  if (!hit) return null
  const { clip, index, offsetInClip } = hit
  if (offsetInClip < MIN_CLIP || clipDuration(clip) - offsetInClip < MIN_CLIP) {
    return null
  }
  const splitSourceTime = clip.inPoint + offsetInClip
  const left: VideoClip = {
    ...clip,
    outPoint: splitSourceTime,
    fadeOut: 0,
    transition: defaultTransition(),
  }
  const right: VideoClip = {
    ...clip,
    id: newId,
    inPoint: splitSourceTime,
    outPoint: clip.outPoint,
    fadeIn: 0,
    transition: clip.transition,
  }
  const next = [...clips]
  next.splice(index, 1, left, right)
  return next
}

export function moveClip(clips: VideoClip[], clipId: string, dir: -1 | 1) {
  const idx = clips.findIndex((c) => c.id === clipId)
  if (idx < 0) return clips
  const nextIdx = idx + dir
  if (nextIdx < 0 || nextIdx >= clips.length) return clips
  const next = [...clips]
  const [item] = next.splice(idx, 1)
  next.splice(nextIdx, 0, item)
  return next
}

export function duplicateClip(
  clips: VideoClip[],
  clipId: string,
  newId: string,
): VideoClip[] | null {
  const idx = clips.findIndex((c) => c.id === clipId)
  if (idx < 0) return null
  const copy: VideoClip = {
    ...clips[idx],
    id: newId,
    transition: { ...clips[idx].transition },
  }
  const next = [...clips]
  next.splice(idx + 1, 0, copy)
  return next
}

/** Drop unused sources. Set revoke=true only when discarding for good (import replace). */
export function pruneSources(
  sources: VideoSource[],
  clips: VideoClip[],
  revoke = false,
  broll: { sourceId: string }[] = [],
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

/** Remove selected clip; timeline closes the gap (ripple). */
export function rippleDeleteClip(
  project: VideoProject,
  clipId: string,
): VideoProject {
  const start = clipStartOnTimeline(project.clips, clipId)
  const clip = project.clips.find((c) => c.id === clipId)
  if (!clip) return project
  const layout = layoutClips(project.clips)
  const item = layout.find((l) => l.clip.id === clipId)
  const span = item ? item.end - item.start : clipDuration(clip)
  const clips = project.clips.filter((c) => c.id !== clipId)
  const sources = pruneSources(project.sources, clips, false, project.broll)
  let playhead = project.playhead
  if (playhead > start + span) playhead -= span
  else if (playhead > start) playhead = start
  playhead = Math.min(playhead, totalDuration(clips))
  const idx = project.clips.findIndex((c) => c.id === clipId)
  const nextSel =
    clips[Math.min(idx, Math.max(0, clips.length - 1))]?.id ?? null
  return {
    ...project,
    clips,
    sources,
    selected: nextSel ? { type: 'clip', id: nextSel } : null,
    playhead,
    isPlaying: false,
  }
}

/**
 * Remove timeline range [from, to], splitting edge clips as needed, then close gap.
 */
export function extractRange(
  clips: VideoClip[],
  from: number,
  to: number,
  idFactory: () => string,
): VideoClip[] | null {
  if (to - from < MIN_CLIP) return null
  let working = clips
  const atTo = splitClipAtPlayhead(working, to, idFactory())
  if (atTo) working = atTo
  const atFrom = splitClipAtPlayhead(working, from, idFactory())
  if (atFrom) working = atFrom

  const layout = layoutClips(working)
  const keep: VideoClip[] = []
  for (const item of layout) {
    const mid = (item.start + item.end) / 2
    if (mid >= from && mid <= to) continue
    keep.push(item.clip)
  }
  return keep
}

/** Keep only [from, to] on the timeline. */
export function isolateRange(
  clips: VideoClip[],
  from: number,
  to: number,
  idFactory: () => string,
): VideoClip[] | null {
  if (to - from < MIN_CLIP) return null
  let working = clips
  const atTo = splitClipAtPlayhead(working, to, idFactory())
  if (atTo) working = atTo
  const atFrom = splitClipAtPlayhead(working, from, idFactory())
  if (atFrom) working = atFrom

  const layout = layoutClips(working)
  const keep: VideoClip[] = []
  for (const item of layout) {
    const mid = (item.start + item.end) / 2
    if (mid >= from && mid <= to) keep.push(item.clip)
  }
  return keep.length ? keep : null
}

export function normalizedMarks(
  markIn: number | null,
  markOut: number | null,
  total: number,
): { from: number; to: number } | null {
  if (markIn == null || markOut == null) return null
  const from = Math.min(markIn, markOut)
  const to = Math.max(markIn, markOut)
  if (to - from < MIN_CLIP) return null
  return {
    from: Math.max(0, from),
    to: Math.min(total, to),
  }
}

export function makeClipFromSource(
  source: VideoSource,
  id = nextVideoId('clip'),
): VideoClip {
  return {
    id,
    sourceId: source.id,
    inPoint: 0,
    outPoint: Math.max(MIN_CLIP, source.duration),
    volume: 1,
    muted: false,
    fadeIn: 0,
    fadeOut: 0,
    transition: defaultTransition(),
  }
}

/** Insert a new clip at playhead (split under playhead first). */
export function insertClipAtPlayhead(
  clips: VideoClip[],
  playhead: number,
  newClip: VideoClip,
  splitId: string,
): VideoClip[] {
  if (!clips.length || playhead <= 0) {
    return [newClip, ...clips]
  }
  const total = totalDuration(clips)
  if (playhead >= total - 0.001) {
    return [...clips, newClip]
  }
  const split = splitClipAtPlayhead(clips, playhead, splitId)
  const base = split ?? clips
  const hit = findClipAtPlayhead(base, playhead)
  const at =
    hit == null
      ? base.length
      : hit.offsetInClip < 0.05
        ? hit.index
        : hit.index + 1
  const next = [...base]
  next.splice(at, 0, newClip)
  return next
}

export function patchClip(
  clips: VideoClip[],
  clipId: string,
  patch: Partial<VideoClip>,
): VideoClip[] {
  return clips.map((c) => {
    if (c.id !== clipId) return c
    if (patch.transition) {
      return {
        ...c,
        ...patch,
        transition: { ...c.transition, ...patch.transition },
      }
    }
    return { ...c, ...patch }
  })
}
