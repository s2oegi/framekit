import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as REPointerEvent,
} from 'react'
import { getPreset } from '../presets'
import type { EditorState, SelectedTarget } from '../types'
import { hitTestText, renderToCanvas } from '../lib/exportCanvas'
import {
  applyResize,
  findTopShapeAt,
  hitTestResizeHandle,
  type ResizeHandle,
} from '../lib/shapes'
import { snapRect, snapShapeOrigin, snapTextPercent } from '../lib/snap'

type Props = {
  state: EditorState
  onSelect: (selected: SelectedTarget) => void
  onMoveShape: (id: string, x: number, y: number) => void
  onResizeShape: (
    id: string,
    patch: { x: number; y: number; width: number; height: number },
  ) => void
  onMoveText: (id: string, xPercent: number, yPercent: number) => void
  onGestureStart: () => void
  onGestureEnd: () => void
}

type DragState =
  | {
      kind: 'shape'
      id: string
      offsetX: number
      offsetY: number
    }
  | {
      kind: 'resize'
      id: string
      handle: ResizeHandle
    }
  | {
      kind: 'text'
      id: string
    }

export function CanvasPreview({
  state,
  onSelect,
  onMoveShape,
  onResizeShape,
  onMoveText,
  onGestureStart,
  onGestureEnd,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.35)
  const dragRef = useRef<DragState | null>(null)
  const stateRef = useRef(state)
  const renderGen = useRef(0)
  const preset = getPreset(state.presetId)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const gen = ++renderGen.current
    let cancelled = false
    let frame = 0

    async function draw() {
      try {
        const canvas = await renderToCanvas(preset, state, {
          includeSafeArea: state.showSafeArea,
          showSelection: true,
        })
        if (cancelled || gen !== renderGen.current || !canvasRef.current) return
        const target = canvasRef.current
        if (
          target.width !== preset.width ||
          target.height !== preset.height
        ) {
          target.width = preset.width
          target.height = preset.height
        }
        const ctx = target.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, preset.width, preset.height)
        ctx.drawImage(canvas, 0, 0)
      } catch {
        // Ignore transient render errors during rapid updates
      }
    }

    frame = requestAnimationFrame(() => {
      void draw()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [state, preset])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    function updateScale() {
      if (!shellRef.current) return
      const rect = shellRef.current.getBoundingClientRect()
      const padX = 32
      const padY = 56 // room for meta row
      const maxW = Math.max(120, rect.width - padX)
      const maxH = Math.max(120, rect.height - padY)
      const next = Math.min(maxW / preset.width, maxH / preset.height, 1)
      setScale((prev) => (Math.abs(prev - next) < 0.002 ? prev : next))
    }

    updateScale()
    const ro = new ResizeObserver(updateScale)
    ro.observe(shell)
    return () => ro.disconnect()
  }, [preset.width, preset.height])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    function blockScroll(e: WheelEvent) {
      e.preventDefault()
    }
    shell.addEventListener('wheel', blockScroll, { passive: false })
    return () => shell.removeEventListener('wheel', blockScroll)
  }, [])

  function toCanvasPoint(e: REPointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const w = rect.width || 1
    const h = rect.height || 1
    return {
      x: ((e.clientX - rect.left) / w) * preset.width,
      y: ((e.clientY - rect.top) / h) * preset.height,
    }
  }

  function onPointerDown(e: REPointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    const { x, y } = toCanvasPoint(e)
    const current = stateRef.current

    if (current.selected?.type === 'shape') {
      const selected = current.shapes.find((s) => s.id === current.selected!.id)
      if (selected) {
        const handle = hitTestResizeHandle(
          selected,
          x,
          y,
          Math.max(16, 22 / scale),
        )
        if (handle) {
          onGestureStart()
          dragRef.current = {
            kind: 'resize',
            id: selected.id,
            handle,
          }
          e.currentTarget.setPointerCapture(e.pointerId)
          return
        }
      }
    }

    const textHit = hitTestText(preset, current, x, y)
    if (textHit) {
      onSelect({ type: 'text', id: textHit.id })
      onGestureStart()
      dragRef.current = { kind: 'text', id: textHit.id }
      e.currentTarget.setPointerCapture(e.pointerId)
      return
    }

    const shape = findTopShapeAt(current.shapes, x, y)
    if (shape) {
      onSelect({ type: 'shape', id: shape.id })
      onGestureStart()
      dragRef.current = {
        kind: 'shape',
        id: shape.id,
        offsetX: x - shape.x,
        offsetY: y - shape.y,
      }
      e.currentTarget.setPointerCapture(e.pointerId)
      return
    }

    onSelect(null)
    dragRef.current = null
  }

  function snapOpts(current: EditorState) {
    return {
      enabled: current.snapToGrid,
      step: current.gridSize,
      threshold: Math.max(8, current.gridSize * 0.22),
      canvasW: preset.width,
      canvasH: preset.height,
      centerGuides: current.centerGuides,
    }
  }

  function onPointerMove(e: REPointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (!drag) return
    const { x, y } = toCanvasPoint(e)
    const current = stateRef.current
    const opt = snapOpts(current)

    if (drag.kind === 'shape') {
      const shape = current.shapes.find((s) => s.id === drag.id)
      const rawX = x - drag.offsetX
      const rawY = y - drag.offsetY
      if (!shape) {
        onMoveShape(drag.id, rawX, rawY)
        return
      }
      const snapped = snapShapeOrigin(
        rawX,
        rawY,
        shape.width,
        shape.height,
        opt,
      )
      onMoveShape(drag.id, snapped.x, snapped.y)
      return
    }

    if (drag.kind === 'resize') {
      const shape = current.shapes.find((s) => s.id === drag.id)
      if (!shape) return
      const patch = applyResize(shape, drag.handle, x, y)
      if (
        patch.x == null ||
        patch.y == null ||
        patch.width == null ||
        patch.height == null
      ) {
        return
      }
      const snapped = snapRect(
        patch.x,
        patch.y,
        patch.width,
        patch.height,
        opt,
      )
      onResizeShape(drag.id, snapped)
      return
    }

    const snapped = snapTextPercent(
      (x / preset.width) * 100,
      (y / preset.height) * 100,
      opt,
    )
    onMoveText(drag.id, snapped.x, snapped.y)
  }

  function onPointerUp(e: REPointerEvent<HTMLCanvasElement>) {
    if (dragRef.current) onGestureEnd()
    dragRef.current = null
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      // Pointer already released
    }
  }

  const stageW = preset.width * scale
  const stageH = preset.height * scale

  return (
    <div className="preview-shell" ref={shellRef}>
      <div className="preview-meta">
        <span>{preset.label}</span>
        <span>
          {preset.width}×{preset.height} · {preset.ratioLabel}
        </span>
        <span className="preview-hint">
          Húzd · sarkoknál átméretezés · szöveget is mozgathatod
        </span>
      </div>
      <div
        className="preview-stage"
        style={{
          width: stageW,
          height: stageH,
        }}
      >
        <canvas
          ref={canvasRef}
          className="preview-canvas interactive"
          style={{
            width: stageW,
            height: stageH,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
    </div>
  )
}
