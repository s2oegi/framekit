import { useEffect, useRef } from 'react'
import { getFont } from '../../fonts'
import { useI18n } from '../../i18n/I18nContext'
import { activeTexts, projectSpan, resolveBroll } from '../../video/broll'
import { peakMeterFromMix, resolveMix, type MixLayer } from '../../video/mix'
import {
  formatTime,
  getSource,
} from '../../video/timeline'
import type { VideoProject } from '../../video/types'

type Props = {
  project: VideoProject
  onPlayhead: (t: number) => void
  onEndedTimeline: () => void
}

type SlotState = {
  url: string | null
  clipId: string | null
}

function setLayerVisual(
  el: HTMLVideoElement,
  layer: MixLayer | undefined,
  role: 'under' | 'over',
  wipe: number | null,
  dual: boolean,
) {
  if (!layer) {
    el.style.opacity = '0'
    el.style.clipPath = 'none'
    el.style.zIndex = '0'
    el.volume = 0
    el.muted = true
    if (!el.paused) el.pause()
    return
  }

  const silent = layer.volume <= 0.001
  el.muted = silent
  el.volume = silent ? 0 : Math.max(0, Math.min(1, layer.volume))
  el.style.zIndex = role === 'over' ? '2' : '1'

  if (wipe != null && dual) {
    el.style.opacity = '1'
    el.style.clipPath =
      role === 'under' ? 'none' : `inset(0 ${(1 - wipe) * 100}% 0 0)`
  } else {
    el.style.opacity = String(layer.opacity)
    el.style.clipPath = 'none'
  }
}

function seekIfNeeded(
  el: HTMLVideoElement,
  sourceTime: number,
  playing: boolean,
  force: boolean,
) {
  const target = Math.max(0, sourceTime)
  const drift = Math.abs(el.currentTime - target)
  const threshold = force ? 0.03 : playing ? 0.35 : 0.04
  if (drift > threshold) {
    try {
      el.currentTime = target
    } catch {
      // seek aborted
    }
  }
}

function bindSource(
  el: HTMLVideoElement,
  slot: SlotState,
  layer: MixLayer | undefined,
  project: VideoProject,
): boolean {
  if (!layer) {
    slot.clipId = null
    return false
  }
  const src = getSource(project, layer.clip.sourceId)
  if (!src) return false

  if (slot.url !== src.objectUrl) {
    el.src = src.objectUrl
    slot.url = src.objectUrl
    slot.clipId = layer.clip.id
    try {
      el.currentTime = Math.max(0, layer.sourceTime)
    } catch {
      // ignore
    }
    return true
  }

  const clipChanged = slot.clipId !== layer.clip.id
  slot.clipId = layer.clip.id
  seekIfNeeded(el, layer.sourceTime, false, clipChanged)
  return true
}

function syncBroll(
  el: HTMLVideoElement,
  slot: SlotState,
  project: VideoProject,
  playhead: number,
  playing: boolean,
) {
  const hit = resolveBroll(project, playhead)
  if (!hit) {
    el.style.opacity = '0'
    el.volume = 0
    el.muted = true
    if (!el.paused) el.pause()
    slot.clipId = null
    return
  }
  const src = getSource(project, hit.clip.sourceId)
  if (!src) return

  if (slot.url !== src.objectUrl) {
    el.src = src.objectUrl
    slot.url = src.objectUrl
    slot.clipId = hit.clip.id
    try {
      el.currentTime = Math.max(0, hit.sourceTime)
    } catch {
      // ignore
    }
  } else {
    const force = slot.clipId !== hit.clip.id
    slot.clipId = hit.clip.id
    seekIfNeeded(el, hit.sourceTime, playing, force)
  }

  el.style.opacity = String(hit.opacity)
  // Above main mix + fade-to-black (z=5), below text overlays (z=7)
  el.style.zIndex = '6'
  const silent = hit.volume <= 0.001
  el.muted = silent
  el.volume = silent ? 0 : Math.max(0, Math.min(1, hit.volume))
  if (playing) {
    if (el.paused) void el.play().catch(() => undefined)
  } else {
    el.pause()
  }
}

export function VideoPreview({
  project,
  onPlayhead,
  onEndedTimeline,
}: Props) {
  const { t } = useI18n()
  const tRef = useRef(t)
  tRef.current = t
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const cRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const slotA = useRef<SlotState>({ url: null, clipId: null })
  const slotB = useRef<SlotState>({ url: null, clipId: null })
  const slotC = useRef<SlotState>({ url: null, clipId: null })
  const rafRef = useRef(0)
  const projectRef = useRef(project)
  const playheadRef = useRef(project.playhead)
  const lastTick = useRef(0)
  const lastUiPush = useRef(0)
  const scrubGen = useRef(0)
  const meterRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const blackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    projectRef.current = project
    if (!project.isPlaying) {
      playheadRef.current = project.playhead
    }
  }, [project])

  const total = projectSpan(project)
  const hasMedia =
    project.clips.length > 0 ||
    project.broll.length > 0 ||
    project.texts.length > 0
  const staticMix = resolveMix(project, project.playhead)
  const visibleTexts = activeTexts(project.texts, project.playhead)

  useEffect(() => {
    if (!hasMedia) {
      slotA.current = { url: null, clipId: null }
      slotB.current = { url: null, clipId: null }
      slotC.current = { url: null, clipId: null }
    }
  }, [hasMedia])

  useEffect(() => {
    if (project.isPlaying || !hasMedia) return
    const a = aRef.current
    const b = bRef.current
    const c = cRef.current
    if (!a || !b || !c) return

    const gen = ++scrubGen.current
    const mix = resolveMix(project, project.playhead)
    const wipe = mix.layers.find((l) => l.wipe != null)?.wipe ?? null
    const dual = mix.layers.length === 2

    bindSource(a, slotA.current, mix.layers[0], project)
    bindSource(b, slotB.current, mix.layers[1], project)

    const apply = () => {
      if (gen !== scrubGen.current) return
      if (mix.layers[0]) {
        seekIfNeeded(a, mix.layers[0].sourceTime, false, true)
        a.pause()
      } else {
        a.pause()
        setLayerVisual(a, undefined, 'under', null, false)
      }
      if (mix.layers[1]) {
        seekIfNeeded(b, mix.layers[1].sourceTime, false, true)
        b.pause()
      } else {
        b.pause()
        setLayerVisual(b, undefined, 'over', null, false)
      }
      setLayerVisual(a, mix.layers[0], 'under', wipe, dual)
      setLayerVisual(b, mix.layers[1], 'over', wipe, dual)
      syncBroll(c, slotC.current, project, project.playhead, false)
      if (blackRef.current) blackRef.current.style.opacity = String(mix.black)
      if (meterRef.current) {
        meterRef.current.style.height = `${peakMeterFromMix(mix) * 100}%`
      }
    }

    if (a.readyState < 2 || (mix.layers[1] && b.readyState < 2)) {
      const onReady = () => {
        a.removeEventListener('loadeddata', onReady)
        b.removeEventListener('loadeddata', onReady)
        apply()
      }
      a.addEventListener('loadeddata', onReady)
      b.addEventListener('loadeddata', onReady)
      requestAnimationFrame(apply)
      return () => {
        a.removeEventListener('loadeddata', onReady)
        b.removeEventListener('loadeddata', onReady)
      }
    }

    apply()
  }, [
    project.isPlaying,
    project.playhead,
    project.clips,
    project.broll,
    project.masterVolume,
    project.sources,
    hasMedia,
  ])

  useEffect(() => {
    if (!project.isPlaying) {
      cancelAnimationFrame(rafRef.current)
      aRef.current?.pause()
      bRef.current?.pause()
      cRef.current?.pause()
      return
    }

    lastTick.current = performance.now()
    lastUiPush.current = 0
    playheadRef.current = projectRef.current.playhead

    const tick = (now: number) => {
      const p = projectRef.current
      if (!p.isPlaying) return

      const dt = Math.min(0.05, Math.max(0, (now - lastTick.current) / 1000))
      lastTick.current = now

      const end = projectSpan(p)
      if (end <= 0) {
        onEndedTimeline()
        return
      }

      let next = playheadRef.current + dt
      if (next >= end - 0.005) {
        playheadRef.current = end
        onPlayhead(end)
        onEndedTimeline()
        return
      }
      playheadRef.current = next

      const mix = resolveMix(p, next)
      const a = aRef.current
      const b = bRef.current
      const c = cRef.current
      const wipe = mix.layers.find((l) => l.wipe != null)?.wipe ?? null
      const dual = mix.layers.length === 2

      if (a && b) {
        const layerA = mix.layers[0]
        const layerB = mix.layers[1]

        if (layerA) {
          const src = getSource(p, layerA.clip.sourceId)
          if (src && slotA.current.url !== src.objectUrl) {
            a.src = src.objectUrl
            slotA.current.url = src.objectUrl
            slotA.current.clipId = layerA.clip.id
            a.currentTime = Math.max(0, layerA.sourceTime)
          } else {
            const force = slotA.current.clipId !== layerA.clip.id
            slotA.current.clipId = layerA.clip.id
            seekIfNeeded(a, layerA.sourceTime, true, force)
          }
          if (a.paused) void a.play().catch(() => undefined)
        } else {
          a.pause()
          slotA.current.clipId = null
          setLayerVisual(a, undefined, 'under', null, false)
        }

        if (layerB) {
          const src = getSource(p, layerB.clip.sourceId)
          if (src && slotB.current.url !== src.objectUrl) {
            b.src = src.objectUrl
            slotB.current.url = src.objectUrl
            slotB.current.clipId = layerB.clip.id
            b.currentTime = Math.max(0, layerB.sourceTime)
          } else {
            const force = slotB.current.clipId !== layerB.clip.id
            slotB.current.clipId = layerB.clip.id
            seekIfNeeded(b, layerB.sourceTime, true, force)
          }
          if (b.paused) void b.play().catch(() => undefined)
        } else {
          b.pause()
          slotB.current.clipId = null
          setLayerVisual(b, undefined, 'over', null, false)
        }

        setLayerVisual(a, layerA, 'under', wipe, dual)
        setLayerVisual(b, layerB, 'over', wipe, dual)
      }

      if (c) syncBroll(c, slotC.current, p, next, true)

      if (blackRef.current) blackRef.current.style.opacity = String(mix.black)
      if (meterRef.current) {
        meterRef.current.style.height = `${peakMeterFromMix(mix) * 100}%`
      }
      if (timeRef.current) {
        timeRef.current.textContent = `${formatTime(next)} / ${formatTime(end)}`
      }
      if (statusRef.current && mix.layers.length) {
        const primary = mix.layers[mix.layers.length - 1]
        statusRef.current.textContent = `${tRef.current('video.clip')} ${
          primary.index + 1
        }${
          dual ? ` · ${tRef.current('video.transitionActive')}` : ''
        } · ${formatTime(primary.sourceTime)}`
      }

      // Live text overlay during playback
      if (overlayRef.current) {
        const texts = activeTexts(p.texts, next)
        overlayRef.current.replaceChildren()
        for (const tx of texts) {
          const node = document.createElement('div')
          node.className = 'video-text-overlay'
          node.textContent = tx.text
          const font = getFont(tx.font)
          node.style.left = `${tx.x}%`
          node.style.top = `${tx.y}%`
          node.style.fontSize = `${tx.fontSize}px`
          node.style.color = tx.color
          node.style.fontFamily = font.family
          node.style.textAlign = tx.align
          node.style.transform =
            tx.align === 'left'
              ? 'translate(0, -50%)'
              : tx.align === 'right'
                ? 'translate(-100%, -50%)'
                : 'translate(-50%, -50%)'
          overlayRef.current.appendChild(node)
        }
      }

      if (now - lastUiPush.current > 80) {
        lastUiPush.current = now
        onPlayhead(next)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [project.isPlaying, onPlayhead, onEndedTimeline])

  return (
    <div className="video-preview">
      <div className="video-preview-frame">
        {hasMedia ? (
          <>
            <video
              ref={aRef}
              className="video-preview-el video-preview-layer"
              playsInline
              preload="auto"
            />
            <video
              ref={bRef}
              className="video-preview-el video-preview-layer"
              playsInline
              preload="auto"
            />
            <video
              ref={cRef}
              className="video-preview-el video-preview-layer video-preview-broll"
              playsInline
              preload="auto"
            />
            <div
              ref={blackRef}
              className="video-preview-black"
              style={{ opacity: staticMix.black }}
              aria-hidden
            />
            <div ref={overlayRef} className="video-preview-overlays" aria-hidden>
              {!project.isPlaying &&
                visibleTexts.map((tx) => {
                  const font = getFont(tx.font)
                  return (
                    <div
                      key={tx.id}
                      className="video-text-overlay"
                      style={{
                        left: `${tx.x}%`,
                        top: `${tx.y}%`,
                        fontSize: tx.fontSize,
                        color: tx.color,
                        fontFamily: font.family,
                        textAlign: tx.align,
                        transform:
                          tx.align === 'left'
                            ? 'translate(0, -50%)'
                            : tx.align === 'right'
                              ? 'translate(-100%, -50%)'
                              : 'translate(-50%, -50%)',
                      }}
                    >
                      {tx.text}
                    </div>
                  )
                })}
            </div>
          </>
        ) : (
          <div className="video-preview-empty">
            <strong>{t('video.noMedia')}</strong>
            <span>{t('video.noMediaHint')}</span>
          </div>
        )}
        {hasMedia && (
          <div className="video-meter" title={t('video.audio')} aria-hidden>
            <div
              ref={meterRef}
              className="video-meter-fill"
              style={{ height: `${peakMeterFromMix(staticMix) * 100}%` }}
            />
          </div>
        )}
      </div>
      <div className="video-preview-meta">
        <span ref={timeRef}>
          {formatTime(project.playhead)} / {formatTime(total)}
        </span>
        <span ref={statusRef}>
          {staticMix.layers.length
            ? `${t('video.clip')} ${
                staticMix.layers[staticMix.layers.length - 1].index + 1
              }${
                staticMix.layers.length > 1
                  ? ` · ${t('video.transitionActive')}`
                  : ''
              }`
            : '—'}
        </span>
      </div>
    </div>
  )
}
