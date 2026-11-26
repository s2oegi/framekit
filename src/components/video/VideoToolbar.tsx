import type { ChangeEvent, RefObject } from 'react'
import { useI18n } from '../../i18n/I18nContext'

type Props = {
  fileRef: RefObject<HTMLInputElement | null>
  hasClips: boolean
  isPlaying: boolean
  canSplit: boolean
  hasSelection: boolean
  hasClipSelection: boolean
  hasMarks: boolean
  snap: boolean
  zoom: number
  onImport: (e: ChangeEvent<HTMLInputElement>) => void
  onTogglePlay: () => void
  onSplit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onAddText: () => void
  onSave: () => void
  onMarkIn: () => void
  onMarkOut: () => void
  onClearMarks: () => void
  onExtract: () => void
  onIsolate: () => void
  onToggleSnap: () => void
  onZoom: (dir: -1 | 1) => void
  onStep: (delta: number) => void
  masterVolume: number
  onMasterVolume: (v: number) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function VideoToolbar({
  fileRef,
  hasClips,
  isPlaying,
  canSplit,
  hasSelection,
  hasClipSelection,
  hasMarks,
  snap,
  zoom,
  onImport,
  onTogglePlay,
  onSplit,
  onDelete,
  onDuplicate,
  onMoveLeft,
  onMoveRight,
  onAddText,
  onSave,
  onMarkIn,
  onMarkOut,
  onClearMarks,
  onExtract,
  onIsolate,
  onToggleSnap,
  onZoom,
  onStep,
  masterVolume,
  onMasterVolume,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: Props) {
  const { t } = useI18n()
  return (
    <div className="video-toolbar">
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        multiple
        hidden
        onChange={onImport}
      />

      <div className="video-toolbar-group">
        <button
          type="button"
          className="header-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="⌘Z"
        >
          {t('common.undo')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="⇧⌘Z"
        >
          {t('common.redo')}
        </button>
        <button
          type="button"
          className="header-btn header-btn-accent"
          onClick={() => fileRef.current?.click()}
        >
          {t('video.add')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onAddText}
          title="T"
        >
          {t('video.addText')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onSave}
          title="⌘S"
        >
          {t('common.save')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onTogglePlay}
          disabled={!hasClips}
          title="Space / K"
        >
          {isPlaying ? t('video.pause') : t('video.play')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={() => onStep(-1 / 30)}
          disabled={!hasClips}
          title="←"
        >
          ‹
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={() => onStep(1 / 30)}
          disabled={!hasClips}
          title="→"
        >
          ›
        </button>
      </div>

      <div className="video-toolbar-group">
        <button
          type="button"
          className="header-btn"
          onClick={onSplit}
          disabled={!canSplit}
          title="S"
        >
          {t('video.split')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onDuplicate}
          disabled={!hasClipSelection}
          title="D"
        >
          {t('video.duplicate')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onMoveLeft}
          disabled={!hasClipSelection}
        >
          ←
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onMoveRight}
          disabled={!hasClipSelection}
        >
          →
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onDelete}
          disabled={!hasSelection}
          title="Delete"
        >
          {t('video.rippleDelete')}
        </button>
      </div>

      <div className="video-toolbar-group">
        <button
          type="button"
          className="header-btn"
          onClick={onMarkIn}
          disabled={!hasClips}
          title="I"
        >
          In
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onMarkOut}
          disabled={!hasClips}
          title="O"
        >
          Out
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onClearMarks}
          disabled={!hasMarks}
          title="X"
        >
          X
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onExtract}
          disabled={!hasMarks}
          title="E"
        >
          {t('video.extract')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={onIsolate}
          disabled={!hasMarks}
          title="U"
        >
          {t('video.isolate')}
        </button>
      </div>

      <div className="video-toolbar-group">
        <button
          type="button"
          className={snap ? 'header-btn header-btn-accent' : 'header-btn'}
          onClick={onToggleSnap}
        >
          {t('video.snap')}
        </button>
        <button
          type="button"
          className="header-btn"
          onClick={() => onZoom(-1)}
        >
          −
        </button>
        <span className="video-zoom-label">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          className="header-btn"
          onClick={() => onZoom(1)}
        >
          +
        </button>
      </div>

      <div className="video-toolbar-group video-toolbar-audio">
        <label className="video-master-vol">
          <span>{t('video.master')}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            onChange={(e) => onMasterVolume(Number(e.target.value))}
          />
          <span className="video-zoom-label">
            {Math.round(masterVolume * 100)}%
          </span>
        </label>
      </div>

      <button type="button" className="header-btn" disabled title="Hamarosan">
        {t('common.exportSoon')}
      </button>
    </div>
  )
}
