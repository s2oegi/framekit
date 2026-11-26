import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as REPointerEvent,
} from 'react'
import { brollEnd } from '../../video/broll'
import { layoutClips, transitionShortKey } from '../../video/mix'
import { useI18n } from '../../i18n/I18nContext'
import {
  formatTime,
  getSource,
  snapTime,
  totalDuration,
} from '../../video/timeline'
import {
  clipDuration,
  selectedClipId,
  type BrollClip,
  type VideoClip,
  type VideoProject,
  type VideoSelection,
  type VideoTextOverlay,
} from '../../video/types'
import { VideoClipInspector } from './VideoClipInspector'
import { VideoOverlayInspector } from './VideoOverlayInspector'

type Props = {
  project: VideoProject
  pxPerSec: number
  onSelect: (sel: VideoSelection) => void
  onPlayhead: (t: number) => void
  onTrimClip: (
    clipId: string,
    patch: { inPoint?: number; outPoint?: number },
  ) => void
  onSlipClip: (clipId: string, deltaSec: number) => void
  onRollEdit: (leftIndex: number, deltaSec: number) => void
  onPatchClip: (clipId: string, patch: Partial<VideoClip>) => void
  onPatchBroll: (id: string, patch: Partial<BrollClip>) => void
  onPatchText: (id: string, patch: Partial<VideoTextOverlay>) => void
  onMoveBroll: (id: string, timelineStart: number) => void
  onMoveText: (id: string, start: number) => void
  onDeleteBroll: (id: string) => void
  onDeleteText: (id: string) => void
}

type DragKind =
  | { type: 'playhead' }
  | {
      type: 'trim-in' | 'trim-out'
      clipId: string
      startX: number
      origIn: number
      origOut: number
    }
  | {
      type: 'slip'
      clipId: string
      startX: number
    }
  | {
      type: 'roll'
      leftIndex: number
      startX: number
    }
  | {
      type: 'broll-move'
      id: string
      startX: number
      origStart: number
    }
  | {
      type: 'broll-trim-in' | 'broll-trim-out'
      id: string
      startX: number
      origIn: number
      origOut: number
      origStart: number
    }
  | {
      type: 'text-move'
      id: string
      startX: number
      origStart: number
    }

function buildRuler(total: number, pxPerSec: number) {
  const marks: { t: number; major: boolean }[] = []
  if (total <= 0) return marks
  const step =
    pxPerSec >= 40 ? 1 : pxPerSec >= 20 ? 2 : pxPerSec >= 10 ? 5 : 10
  const minor = step >= 5 ? 1 : step / 2
  const count = Math.ceil(total / minor) + 1
  for (let i = 0; i < count; i++) {
    const t = Math.round(i * minor * 1000) / 1000
    if (t > total + 0.001) break
    const major = Math.abs(t / step - Math.round(t / step)) < 0.001
    marks.push({ t, major })
  }
  return marks
}

export function VideoTimeline({
  project,
  pxPerSec,
  onSelect,
  onPlayhead,
  onTrimClip,
  onSlipClip,
  onRollEdit,
  onPatchClip,
  onPatchBroll,
  onPatchText,
  onMoveBroll,
  onMoveText,
  onDeleteBroll,
  onDeleteText,
}: Props) {
  const { t } = useI18n()
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragKind | null>(null)
  const lastSlipX = useRef(0)
  const lastRollX = useRef(0)
  const [viewportW, setViewportW] = useState(480)
  const mainTotal = totalDuration(project.clips)
  let span = mainTotal
  for (const b of project.broll) span = Math.max(span, brollEnd(b))
  for (const tx of project.texts) span = Math.max(span, tx.end)
  const total = Math.max(span, 0.01)
  const width = Math.max(total * pxPerSec + 48, viewportW)
  const layout = layoutClips(project.clips)
  const clipSel = selectedClipId(project)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const update = () => setViewportW(el.clientWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const ruler = useMemo(
    () => buildRuler(total, pxPerSec),
    [total, pxPerSec],
  )

  useEffect(() => {
    const el = trackRef.current
    if (!el || total <= 0) return
    const x = project.playhead * pxPerSec
    const left = el.scrollLeft
    const right = left + el.clientWidth
    const pad = el.clientWidth * 0.2
    if (x < left + pad) {
      el.scrollLeft = Math.max(0, x - pad)
    } else if (x > right - pad) {
      el.scrollLeft = x - el.clientWidth + pad
    }
  }, [project.playhead, pxPerSec, total, project.isPlaying])

  function timeFromClientX(clientX: number) {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    const x = clientX - rect.left + track.scrollLeft
    const raw = Math.max(0, Math.min(total || 0, x / pxPerSec))
    return snapTime(
      raw,
      project.clips,
      project.snap,
      10 / pxPerSec,
      [project.markIn ?? -1, project.markOut ?? -1].filter((n) => n >= 0),
    )
  }

  function onTrackPointerDown(e: REPointerEvent<HTMLDivElement>) {
    if (
      (e.target as HTMLElement).closest(
        '.video-clip, .video-roll, .video-audio-lane, .video-broll-clip, .video-text-clip',
      )
    ) {
      return
    }
    dragRef.current = { type: 'playhead' }
    onSelect(null)
    onPlayhead(timeFromClientX(e.clientX))
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: REPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag) return
    if (drag.type === 'playhead') {
      onPlayhead(timeFromClientX(e.clientX))
      return
    }

    if (drag.type === 'slip') {
      const dx = (e.clientX - lastSlipX.current) / pxPerSec
      lastSlipX.current = e.clientX
      if (Math.abs(dx) > 0) onSlipClip(drag.clipId, dx)
      return
    }

    if (drag.type === 'roll') {
      const dx = (e.clientX - lastRollX.current) / pxPerSec
      lastRollX.current = e.clientX
      if (Math.abs(dx) > 0) onRollEdit(drag.leftIndex, dx)
      return
    }

    if (drag.type === 'broll-move') {
      const dx = (e.clientX - drag.startX) / pxPerSec
      onMoveBroll(drag.id, Math.max(0, drag.origStart + dx))
      return
    }

    if (drag.type === 'text-move') {
      const dx = (e.clientX - drag.startX) / pxPerSec
      onMoveText(drag.id, Math.max(0, drag.origStart + dx))
      return
    }

    if (drag.type === 'broll-trim-in' || drag.type === 'broll-trim-out') {
      const dx = (e.clientX - drag.startX) / pxPerSec
      if (drag.type === 'broll-trim-in') {
        onPatchBroll(drag.id, {
          inPoint: drag.origIn + dx,
          outPoint: drag.origOut,
          timelineStart: drag.origStart + dx,
        })
      } else {
        onPatchBroll(drag.id, {
          inPoint: drag.origIn,
          outPoint: drag.origOut + dx,
          timelineStart: drag.origStart,
        })
      }
      return
    }

    if (drag.type !== 'trim-in' && drag.type !== 'trim-out') return

    const dx = (e.clientX - drag.startX) / pxPerSec
    const clip = project.clips.find((c) => c.id === drag.clipId)
    if (!clip) return

    if (drag.type === 'trim-in') {
      onTrimClip(clip.id, {
        inPoint: drag.origIn + dx,
        outPoint: drag.origOut,
      })
    } else {
      onTrimClip(clip.id, {
        inPoint: drag.origIn,
        outPoint: drag.origOut + dx,
      })
    }
  }

  function onPointerUp(e: REPointerEvent<HTMLDivElement>) {
    dragRef.current = null
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }
  }

  function startTrim(
    e: REPointerEvent<HTMLButtonElement>,
    clip: VideoClip,
    edge: 'in' | 'out',
  ) {
    e.stopPropagation()
    e.preventDefault()
    onSelect({ type: 'clip', id: clip.id })
    dragRef.current = {
      type: edge === 'in' ? 'trim-in' : 'trim-out',
      clipId: clip.id,
      startX: e.clientX,
      origIn: clip.inPoint,
      origOut: clip.outPoint,
    }
    trackRef.current?.setPointerCapture(e.pointerId)
  }

  function startSlip(e: REPointerEvent<HTMLDivElement>, clip: VideoClip) {
    if (!e.altKey) return false
    e.stopPropagation()
    onSelect({ type: 'clip', id: clip.id })
    dragRef.current = { type: 'slip', clipId: clip.id, startX: e.clientX }
    lastSlipX.current = e.clientX
    trackRef.current?.setPointerCapture(e.pointerId)
    return true
  }

  function startRoll(e: REPointerEvent<HTMLButtonElement>, leftIndex: number) {
    e.stopPropagation()
    e.preventDefault()
    dragRef.current = { type: 'roll', leftIndex, startX: e.clientX }
    lastRollX.current = e.clientX
    trackRef.current?.setPointerCapture(e.pointerId)
  }

  const markFrom =
    project.markIn != null && project.markOut != null
      ? Math.min(project.markIn, project.markOut)
      : project.markIn
  const markTo =
    project.markIn != null && project.markOut != null
      ? Math.max(project.markIn, project.markOut)
      : project.markOut

  const showClipInspector = project.selected?.type === 'clip'
  const showOverlayInspector =
    project.selected?.type === 'broll' || project.selected?.type === 'text'

  return (
    <div className="video-timeline">
      <div className="video-timeline-label">
        <span>
          {t('video.timeline')} · {formatTime(total, true)}
          {project.snap ? ` · ${t('video.snapOn')}` : ''}
        </span>
        <span className="field-note">{t('video.timelineHint')}</span>
      </div>

      <div className="video-timeline-shell video-timeline-shell-multi">
        <div className="video-track-labels video-track-labels-multi" aria-hidden>
          <span>V1</span>
          <span>A1</span>
          <span>B1</span>
          <span>T1</span>
        </div>

        <div
          className="video-timeline-scroll"
          ref={trackRef}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="video-timeline-track video-timeline-track-multi"
            style={{ width }}
          >
            <div className="video-ruler">
              {ruler.map((m) => (
                <div
                  key={m.t}
                  className={
                    m.major ? 'video-ruler-mark major' : 'video-ruler-mark'
                  }
                  style={{ left: m.t * pxPerSec }}
                >
                  {m.major && <span>{formatTime(m.t)}</span>}
                </div>
              ))}
            </div>

            {markFrom != null && markTo != null && markTo > markFrom && (
              <div
                className="video-mark-range"
                style={{
                  left: markFrom * pxPerSec,
                  width: (markTo - markFrom) * pxPerSec,
                }}
              />
            )}
            {project.markIn != null && (
              <div
                className="video-mark video-mark-in"
                style={{ left: project.markIn * pxPerSec }}
              />
            )}
            {project.markOut != null && (
              <div
                className="video-mark video-mark-out"
                style={{ left: project.markOut * pxPerSec }}
              />
            )}

            {layout.length === 0 && (
              <div className="video-timeline-empty">
                {t('video.emptyTrack')}
              </div>
            )}

            {layout.map((item) => {
              const { clip, start, end, overlapOut, index: i } = item
              const left = start * pxPerSec
              const w = Math.max((end - start) * pxPerSec, 28)
              const selected = clipSel === clip.id
              const source = getSource(project, clip.sourceId)
              const shortKey = transitionShortKey(clip.transition.type)
              const transLabel = shortKey ? t(shortKey) : ''
              const shortName = source
                ? source.name.replace(/\.[^.]+$/, '')
                : t('video.clip')

              return (
                <div key={clip.id}>
                  <div
                    className={
                      selected
                        ? 'video-clip video-clip-selected'
                        : 'video-clip'
                    }
                    style={{ left, width: w }}
                    onPointerDown={(e) => {
                      if (startSlip(e, clip)) return
                      e.stopPropagation()
                      onSelect({ type: 'clip', id: clip.id })
                      onPlayhead(timeFromClientX(e.clientX))
                      dragRef.current = { type: 'playhead' }
                      trackRef.current?.setPointerCapture(e.pointerId)
                    }}
                  >
                    <button
                      type="button"
                      className="video-trim video-trim-in"
                      aria-label={t('video.trimIn')}
                      onPointerDown={(e) => startTrim(e, clip, 'in')}
                    />
                    <div className="video-clip-body">
                      <strong>
                        {i + 1}. {shortName}
                      </strong>
                      <span>
                        {formatTime(end - start)}
                        {clip.muted ? ` · ${t('common.muted')}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="video-trim video-trim-out"
                      aria-label={t('video.trimOut')}
                      onPointerDown={(e) => startTrim(e, clip, 'out')}
                    />
                    {(clip.fadeIn > 0 || clip.fadeOut > 0) && (
                      <div className="video-fade-hints" aria-hidden>
                        {clip.fadeIn > 0 && (
                          <span
                            className="video-fade-in"
                            style={{
                              width: Math.min(w * 0.45, clip.fadeIn * pxPerSec),
                            }}
                          />
                        )}
                        {clip.fadeOut > 0 && (
                          <span
                            className="video-fade-out"
                            style={{
                              width: Math.min(
                                w * 0.45,
                                clip.fadeOut * pxPerSec,
                              ),
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={
                      selected
                        ? 'video-audio-lane video-audio-lane-selected'
                        : 'video-audio-lane'
                    }
                    style={{ left, width: w }}
                    title={`${t('video.audio')} ${Math.round(clip.volume * 100)}%`}
                  >
                    <span
                      className="video-audio-wave"
                      style={{
                        opacity: clip.muted ? 0.25 : 0.45 + clip.volume * 0.4,
                        transform: `scaleY(${clip.muted ? 0.2 : 0.35 + clip.volume * 0.55})`,
                      }}
                    />
                  </div>

                  {overlapOut > 0 && transLabel && (
                    <div
                      className="video-transition-badge"
                      style={{
                        left: (end - overlapOut) * pxPerSec,
                        width: Math.max(overlapOut * pxPerSec, 36),
                      }}
                      title={`${transLabel} · ${clip.transition.duration.toFixed(2)}s`}
                    >
                      {transLabel}
                    </div>
                  )}

                  {i < project.clips.length - 1 && (
                    <button
                      type="button"
                      className="video-roll"
                      style={{ left: end * pxPerSec }}
                      aria-label="Roll"
                      title={t('video.roll')}
                      onPointerDown={(e) => startRoll(e, i)}
                    />
                  )}
                </div>
              )
            })}

            <div className="video-broll-lane" aria-label={t('video.broll')}>
              {project.broll.map((clip) => {
                const left = clip.timelineStart * pxPerSec
                const w = Math.max(clipDuration(clip) * pxPerSec, 24)
                const selected =
                  project.selected?.type === 'broll' &&
                  project.selected.id === clip.id
                const source = getSource(project, clip.sourceId)
                const shortName = source
                  ? source.name.replace(/\.[^.]+$/, '')
                  : t('video.broll')
                return (
                  <div
                    key={clip.id}
                    className={
                      selected
                        ? 'video-broll-clip video-broll-clip-selected'
                        : 'video-broll-clip'
                    }
                    style={{
                      left,
                      width: w,
                      opacity: 0.55 + clip.opacity * 0.45,
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      onSelect({ type: 'broll', id: clip.id })
                      dragRef.current = {
                        type: 'broll-move',
                        id: clip.id,
                        startX: e.clientX,
                        origStart: clip.timelineStart,
                      }
                      trackRef.current?.setPointerCapture(e.pointerId)
                    }}
                  >
                    <button
                      type="button"
                      className="video-trim video-trim-in"
                      aria-label={t('video.trimIn')}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onSelect({ type: 'broll', id: clip.id })
                        dragRef.current = {
                          type: 'broll-trim-in',
                          id: clip.id,
                          startX: e.clientX,
                          origIn: clip.inPoint,
                          origOut: clip.outPoint,
                          origStart: clip.timelineStart,
                        }
                        trackRef.current?.setPointerCapture(e.pointerId)
                      }}
                    />
                    <div className="video-clip-body">
                      <strong>{shortName}</strong>
                      <span>{formatTime(clipDuration(clip))}</span>
                    </div>
                    <button
                      type="button"
                      className="video-trim video-trim-out"
                      aria-label={t('video.trimOut')}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onSelect({ type: 'broll', id: clip.id })
                        dragRef.current = {
                          type: 'broll-trim-out',
                          id: clip.id,
                          startX: e.clientX,
                          origIn: clip.inPoint,
                          origOut: clip.outPoint,
                          origStart: clip.timelineStart,
                        }
                        trackRef.current?.setPointerCapture(e.pointerId)
                      }}
                    />
                  </div>
                )
              })}
            </div>

            <div className="video-text-lane" aria-label={t('video.textOverlay')}>
              {project.texts.map((tx) => {
                const left = tx.start * pxPerSec
                const w = Math.max((tx.end - tx.start) * pxPerSec, 24)
                const selected =
                  project.selected?.type === 'text' &&
                  project.selected.id === tx.id
                return (
                  <div
                    key={tx.id}
                    className={
                      selected
                        ? 'video-text-clip video-text-clip-selected'
                        : 'video-text-clip'
                    }
                    style={{ left, width: w }}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      onSelect({ type: 'text', id: tx.id })
                      dragRef.current = {
                        type: 'text-move',
                        id: tx.id,
                        startX: e.clientX,
                        origStart: tx.start,
                      }
                      trackRef.current?.setPointerCapture(e.pointerId)
                    }}
                  >
                    <strong>{tx.text || t('video.textOverlay')}</strong>
                  </div>
                )
              })}
            </div>

            {total > 0 && (
              <div
                className="video-playhead"
                style={{ left: project.playhead * pxPerSec }}
              />
            )}
          </div>
        </div>
      </div>

      {showClipInspector ? (
        <VideoClipInspector
          project={project}
          onTrimClip={onTrimClip}
          onSlipClip={onSlipClip}
          onPatchClip={onPatchClip}
        />
      ) : showOverlayInspector ? (
        <VideoOverlayInspector
          project={project}
          onPatchBroll={onPatchBroll}
          onPatchText={onPatchText}
          onDeleteBroll={onDeleteBroll}
          onDeleteText={onDeleteText}
        />
      ) : (
        (project.clips.length > 0 ||
          project.broll.length > 0 ||
          project.texts.length > 0) && (
          <p className="video-inspector-hint">{t('video.selectHint')}</p>
        )
      )}
    </div>
  )
}
