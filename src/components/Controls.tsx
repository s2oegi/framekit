import { useState, type ChangeEvent } from 'react'
import { FONT_GROUP_LABELS, FONTS } from '../fonts'
import type { Session } from '../lib/authStore'
import type { SavedProject } from '../lib/projectStore'
import {
  deleteCustomTemplate,
  listCustomTemplates,
  rematerializeState,
  saveCustomTemplate,
} from '../lib/templateStore'
import { getPreset, presetsFor } from '../presets'
import {
  templateDescription,
  templateLabel,
  templatesFor,
} from '../templates'
import {
  createShape,
  createTextLayer,
  defaultEditorState,
  SHAPE_GROUPS,
  shapeLabel,
  type Align,
  type CanvasShape,
  type ControlTab,
  type EditorState,
  type ShapeKind,
  type TextLayer,
} from '../types'
import { useI18n } from '../i18n/I18nContext'
import type { MessageKey } from '../i18n/messages'
import { CollapsibleSection } from './CollapsibleSection'
import { ProjectsPanel } from './ProjectsPanel'
import { ShapeTile } from './ShapeTile'
import {
  invalidateTemplatePreview,
  TemplateTile,
} from './TemplateTile'

type Props = {
  state: EditorState
  onChange: (patch: Partial<EditorState>) => void
  onApplyTemplate: (state: EditorState) => void
  onUpdateShape: (id: string, patch: Partial<CanvasShape>) => void
  onRemoveShape: (id: string) => void
  onReorderShape: (id: string, dir: -1 | 1 | 'front' | 'back') => void
  onDuplicateShape: (id: string) => void
  onUpdateText: (id: string, patch: Partial<TextLayer>) => void
  onRemoveText: (id: string) => void
  onReorderText: (id: string, dir: -1 | 1) => void
  onDuplicateText: (id: string) => void
  onAlignShape: (id: string, where: 'h' | 'v' | 'c') => void
  onExport: () => void
  exporting: boolean
  exportError: string | null
  session: Session | null
  projectId: string | null
  projectName: string
  onProjectNameChange: (name: string) => void
  onSaveProject: () => void
  onLoadProject: (project: SavedProject) => void
  onAskAuth: () => void
  saveStatus: string | null
  saveError: string | null
  onHidePanel?: () => void
}

const TAB_KEYS: { id: ControlTab; label: MessageKey }[] = [
  { id: 'files', label: 'tabs.files' },
  { id: 'bg', label: 'tabs.bg' },
  { id: 'shapes', label: 'tabs.shapes' },
  { id: 'text', label: 'tabs.text' },
  { id: 'fx', label: 'tabs.fx' },
]

export function Controls({
  state,
  onChange,
  onApplyTemplate,
  onUpdateShape,
  onRemoveShape,
  onReorderShape,
  onDuplicateShape,
  onUpdateText,
  onRemoveText,
  onReorderText,
  onDuplicateText,
  onAlignShape,
  onExport,
  exporting,
  exportError,
  session,
  projectId,
  projectName,
  onProjectNameChange,
  onSaveProject,
  onLoadProject,
  onAskAuth,
  saveStatus,
  saveError,
  onHidePanel,
}: Props) {
  const { t, te, locale } = useI18n()
  const [templateTick, setTemplateTick] = useState(0)
  const [templateName, setTemplateName] = useState('')
  const [templateDesc, setTemplateDesc] = useState('')
  const [templateStatus, setTemplateStatus] = useState<string | null>(null)
  const [templateError, setTemplateError] = useState<string | null>(null)
  const presets = presetsFor(state.kind)
  const preset = getPreset(state.presetId)
  const templates = templatesFor(state.kind)
  void templateTick
  const customTemplates = listCustomTemplates(state.kind)
  const selected = state.selected
  const selectedShape =
    selected?.type === 'shape'
      ? state.shapes.find((s) => s.id === selected.id)
      : undefined
  const selectedText =
    selected?.type === 'text'
      ? state.texts.find((t) => t.id === selected.id)
      : undefined

  function onImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          backgroundImage: reader.result,
          overlayOpacity:
            state.overlayOpacity > 0 ? state.overlayOpacity : 0.35,
        })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function addShape(kind: ShapeKind) {
    const shape = createShape(kind, preset.width, preset.height)
    onChange({
      shapes: [...state.shapes, shape],
      selected: { type: 'shape', id: shape.id },
      activeTab: 'shapes',
    })
  }

  function addText() {
    const layer = createTextLayer(state.kind, {
      label: `Szöveg ${state.texts.length + 1}`,
      text: t('controls.newText'),
      y: 50,
      size: 64,
      color: '#F4F1EA',
    })
    onChange({
      texts: [...state.texts, layer],
      selected: { type: 'text', id: layer.id },
      activeTab: 'text',
    })
  }

  function handleSaveTemplate(overwriteSameName: boolean) {
    const name = templateName.trim()
    if (!name) {
      setTemplateError(t('templates.nameRequired'))
      setTemplateStatus(null)
      return
    }
    try {
      const existing = overwriteSameName
        ? customTemplates.find(
            (c) => c.name.toLowerCase() === name.toLowerCase(),
          )
        : undefined
      const saved = saveCustomTemplate({
        id: existing?.id,
        name,
        description: templateDesc,
        kind: state.kind,
        state,
      })
      invalidateTemplatePreview(`custom:${saved.id}:${saved.updatedAt}`)
      setTemplateTick((n) => n + 1)
      setTemplateError(null)
      setTemplateStatus(
        existing ? t('templates.updated') : t('templates.saved'),
      )
      if (!existing) setTemplateName('')
    } catch (err) {
      setTemplateStatus(null)
      setTemplateError(
        err instanceof Error ? te(err.message) : t('editor.saveFailed'),
      )
    }
  }

  function handleDeleteTemplate(id: string) {
    if (!confirm(t('templates.confirmDelete'))) return
    deleteCustomTemplate(id)
    setTemplateTick((n) => n + 1)
  }

  return (
    <aside className="controls">
      {onHidePanel && (
        <div className="controls-head">
          <button
            type="button"
            className="panel-toggle-btn"
            onClick={onHidePanel}
          >
            {t('editor.hidePanel')}
          </button>
        </div>
      )}
      <div className="control-tabs">
        {TAB_KEYS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={
              state.activeTab === tab.id
                ? 'control-tab control-tab-active'
                : 'control-tab'
            }
            onClick={() => onChange({ activeTab: tab.id })}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {state.activeTab === 'files' && (
        <ProjectsPanel
          kind={state.kind}
          projectId={projectId}
          projectName={projectName}
          session={session}
          onNameChange={onProjectNameChange}
          onSave={onSaveProject}
          onLoad={onLoadProject}
          onAskAuth={onAskAuth}
          status={saveStatus}
          error={saveError}
        />
      )}

      {state.activeTab === 'bg' && (
        <>
          <CollapsibleSection title={t('controls.templates')} storageKey="ctrl-templates">
            <p className="shape-group-label">{t('templates.builtin')}</p>
            <div className="template-grid">
              {templates.map((tmpl) => (
                <TemplateTile
                  key={`${tmpl.id}-${locale}`}
                  cacheKey={`builtin:v5:${locale}:${tmpl.id}`}
                  state={tmpl.build(locale)}
                  label={templateLabel(tmpl, locale)}
                  description={templateDescription(tmpl, locale)}
                  accent={tmpl.accent}
                  onClick={() => onApplyTemplate(tmpl.build(locale))}
                />
              ))}
              <TemplateTile
                key={`empty-${locale}-${state.kind}`}
                cacheKey={`empty:v5:${locale}:${state.kind}`}
                state={defaultEditorState(state.kind, locale)}
                label={t('controls.emptyBase')}
                description={t('controls.emptyBaseDesc')}
                accent="#3A4154"
                onClick={() =>
                  onApplyTemplate(defaultEditorState(state.kind, locale))
                }
              />
            </div>

            <p className="shape-group-label">{t('templates.custom')}</p>
            {customTemplates.length === 0 ? (
              <p className="field-note">{t('templates.emptyCustom')}</p>
            ) : (
              <div className="template-grid">
                {customTemplates.map((tmpl) => (
                  <TemplateTile
                    key={tmpl.id}
                    cacheKey={`custom:${tmpl.id}:${tmpl.updatedAt}`}
                    state={tmpl.state}
                    label={tmpl.name}
                    description={tmpl.description || t('templates.apply')}
                    accent={tmpl.accent}
                    onClick={() =>
                      onApplyTemplate(rematerializeState(tmpl.state))
                    }
                    onDelete={() => handleDeleteTemplate(tmpl.id)}
                    deleteLabel={t('templates.delete')}
                  />
                ))}
              </div>
            )}

            <p className="shape-group-label">{t('templates.saveCurrent')}</p>
            <label className="field">
              <span>{t('templates.name')}</span>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder={projectName}
              />
            </label>
            <label className="field">
              <span>{t('templates.desc')}</span>
              <input
                type="text"
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
              />
            </label>
            <div className="align-row">
              <button
                type="button"
                className="chip add-wide"
                onClick={() => handleSaveTemplate(false)}
              >
                {t('templates.save')}
              </button>
              {customTemplates.some(
                (c) =>
                  c.name.toLowerCase() === templateName.trim().toLowerCase(),
              ) && (
                <button
                  type="button"
                  className="chip"
                  onClick={() => handleSaveTemplate(true)}
                >
                  {t('templates.overwrite')}
                </button>
              )}
            </div>
            {templateStatus && (
              <p className="save-status">{templateStatus}</p>
            )}
            {templateError && (
              <p className="export-error">{templateError}</p>
            )}
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.preset')} storageKey="ctrl-preset">
            <div className="preset-row">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={
                    state.presetId === p.id ? 'chip chip-active' : 'chip'
                  }
                  onClick={() => onChange({ presetId: p.id })}
                >
                  {p.label}
                  <small>
                    {p.width}×{p.height}
                  </small>
                </button>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.colors')} storageKey="ctrl-colors">
            <label className="check">
              <input
                type="checkbox"
                checked={state.useGradient}
                onChange={(e) => onChange({ useGradient: e.target.checked })}
              />
              {t('controls.gradient')}
            </label>
            <div className="field-row">
              <label className="field">
                <span>{t('controls.color1')}</span>
                <input
                  type="color"
                  value={state.backgroundColor}
                  onChange={(e) =>
                    onChange({ backgroundColor: e.target.value })
                  }
                />
              </label>
              <label className="field">
                <span>{t('controls.color2')}</span>
                <input
                  type="color"
                  value={state.backgroundColor2}
                  disabled={!state.useGradient}
                  onChange={(e) =>
                    onChange({ backgroundColor2: e.target.value })
                  }
                />
              </label>
            </div>
            {state.useGradient && (
              <label className="field">
                <span>Szög · {state.gradientAngle}°</span>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={state.gradientAngle}
                  onChange={(e) =>
                    onChange({ gradientAngle: Number(e.target.value) })
                  }
                />
              </label>
            )}
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.bgImage')} storageKey="ctrl-bgImage">
            <label className="field file-field">
              <span>{t('controls.upload')}</span>
              <input type="file" accept="image/*" onChange={onImage} />
            </label>
            {state.backgroundImage && (
              <>
                <label className="field">
                  <span>Zoom · {state.imageZoom.toFixed(2)}×</span>
                  <input
                    type="range"
                    min={100}
                    max={300}
                    value={Math.round(state.imageZoom * 100)}
                    onChange={(e) =>
                      onChange({ imageZoom: Number(e.target.value) / 100 })
                    }
                  />
                </label>
                <label className="field">
                  <span>X · {state.imageOffsetX}%</span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={state.imageOffsetX}
                    onChange={(e) =>
                      onChange({ imageOffsetX: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>Y · {state.imageOffsetY}%</span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={state.imageOffsetY}
                    onChange={(e) =>
                      onChange({ imageOffsetY: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>{t('controls.tint')}</span>
                  <input
                    type="color"
                    value={state.overlayColor}
                    onChange={(e) => onChange({ overlayColor: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>
                    Tint erősség · {Math.round(state.overlayOpacity * 100)}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={85}
                    value={Math.round(state.overlayOpacity * 100)}
                    onChange={(e) =>
                      onChange({
                        overlayOpacity: Number(e.target.value) / 100,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  className="linkish"
                  onClick={() =>
                    onChange({ backgroundImage: null, overlayOpacity: 0 })
                  }
                >
                  Kép eltávolítása
                </button>
              </>
            )}
          </CollapsibleSection>
        </>
      )}

      {state.activeTab === 'shapes' && (
        <>
          <CollapsibleSection title={t('controls.quickMenus')} storageKey="ctrl-quickMenus">
          <div className="shape-add-row">
            <button
              type="button"
              className="chip"
              onClick={() => {
                addShape('bar')
                addShape('circle')
              }}
            >
              {t('controls.quickAccent')}
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => {
                addShape('banner')
                addShape('play')
              }}
            >
              {t('controls.quickYt')}
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => {
                addShape('frame')
                addShape('badge')
              }}
            >
              {t('controls.quickFrame')}
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => addShape('lightning')}
            >
              {t('controls.quickPop')}
            </button>
          </div>
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.newShape')} storageKey="ctrl-newShape">
          {SHAPE_GROUPS.map((group) => (
            <div key={group.label.en} className="shape-group">
              <p className="shape-group-label">{group.label[locale]}</p>
              <div className="shape-tile-grid">
                {group.kinds.map((kind) => (
                  <ShapeTile
                    key={kind}
                    kind={kind}
                    onClick={() => addShape(kind)}
                  />
                ))}
              </div>
            </div>
          ))}

          {state.shapes.length > 0 && (
            <div className="shape-list">
              {state.shapes.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={
                    selectedShape?.id === s.id
                      ? 'shape-item shape-item-active'
                      : 'shape-item'
                  }
                  onClick={() =>
                    onChange({ selected: { type: 'shape', id: s.id } })
                  }
                >
                  <span
                    className="shape-swatch"
                    style={{
                      background:
                        s.fill === 'transparent' ? s.stroke : s.fill,
                    }}
                    aria-hidden
                  />
                  {shapeLabel(s.kind, locale)} {i + 1}
                </button>
              ))}
            </div>
          )}
          </CollapsibleSection>

          {selectedShape && (
            <CollapsibleSection
              title={shapeLabel(selectedShape.kind, locale)}
              storageKey="ctrl-shapeEdit"
              defaultOpen
            >
              <div className="shape-editor">
              <p className="shape-editor-title">
                {shapeLabel(selectedShape.kind, locale)} —{' '}
                {t('controls.dragResize')}
              </p>

              <p className="shape-group-label">{t('controls.quickColors')}</p>
              <div className="shape-add-row">
                {[
                  '#F5A524',
                  '#FF3B30',
                  '#34C759',
                  '#0A84FF',
                  '#AF52DE',
                  '#FFFFFF',
                  '#000000',
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="chip color-chip"
                    style={{ background: c, color: c === '#FFFFFF' || c === '#F5A524' ? '#111' : '#fff' }}
                    onClick={() =>
                      onUpdateShape(selectedShape.id, { fill: c })
                    }
                    title={c}
                  >
                    ●
                  </button>
                ))}
              </div>

              <label className="check">
                <input
                  type="checkbox"
                  checked={selectedShape.useGradient}
                  onChange={(e) =>
                    onUpdateShape(selectedShape.id, {
                      useGradient: e.target.checked,
                    })
                  }
                />
                Gradiens kitöltés
              </label>
              <div className="field-row">
                <label className="field">
                  <span>{t('controls.fill')}</span>
                  <input
                    type="color"
                    value={
                      selectedShape.fill === 'transparent'
                        ? '#000000'
                        : selectedShape.fill
                    }
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        fill: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="field">
                  <span>{t('controls.fill2')}</span>
                  <input
                    type="color"
                    value={selectedShape.fill2}
                    disabled={!selectedShape.useGradient}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        fill2: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
              {selectedShape.useGradient && (
                <label className="field">
                  <span>Gradiens szög · {selectedShape.gradientAngle}°</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={selectedShape.gradientAngle}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        gradientAngle: Number(e.target.value),
                      })
                    }
                  />
                </label>
              )}

              <div className="field-row">
                <label className="field">
                  <span>{t('controls.stroke')}</span>
                  <input
                    type="color"
                    value={selectedShape.stroke}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        stroke: e.target.value,
                      })
                    }
                  />
                </label>
                <label className="field">
                  <span>{selectedShape.strokeWidth}px</span>
                  <input
                    type="range"
                    min={0}
                    max={48}
                    value={selectedShape.strokeWidth}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        strokeWidth: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>

              {(selectedShape.kind === 'rect' ||
                selectedShape.kind === 'round' ||
                selectedShape.kind === 'pill' ||
                selectedShape.kind === 'squircle' ||
                selectedShape.kind === 'bar' ||
                selectedShape.kind === 'frame') && (
                <label className="field">
                  <span>Lekerekítés · {selectedShape.cornerRadius}%</span>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={selectedShape.cornerRadius}
                    onChange={(e) =>
                      onUpdateShape(selectedShape.id, {
                        cornerRadius: Number(e.target.value),
                      })
                    }
                  />
                </label>
              )}

              <label className="field">
                <span>
                  Átlátszóság · {Math.round(selectedShape.opacity * 100)}%
                </span>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={Math.round(selectedShape.opacity * 100)}
                  onChange={(e) =>
                    onUpdateShape(selectedShape.id, {
                      opacity: Number(e.target.value) / 100,
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Forgatás · {Math.round(selectedShape.rotation)}°</span>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={selectedShape.rotation}
                  onChange={(e) =>
                    onUpdateShape(selectedShape.id, {
                      rotation: Number(e.target.value),
                    })
                  }
                />
              </label>

              <label className="check">
                <input
                  type="checkbox"
                  checked={selectedShape.shadow}
                  onChange={(e) =>
                    onUpdateShape(selectedShape.id, {
                      shadow: e.target.checked,
                    })
                  }
                />
                Árnyék
              </label>
              {selectedShape.shadow && (
                <>
                  <label className="field">
                    <span>Blur · {selectedShape.shadowBlur}px</span>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      value={selectedShape.shadowBlur}
                      onChange={(e) =>
                        onUpdateShape(selectedShape.id, {
                          shadowBlur: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Árnyék Y · {selectedShape.shadowOffsetY}px</span>
                    <input
                      type="range"
                      min={-40}
                      max={60}
                      value={selectedShape.shadowOffsetY}
                      onChange={(e) =>
                        onUpdateShape(selectedShape.id, {
                          shadowOffsetY: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </>
              )}

              <div className="align-row">
                <button
                  type="button"
                  className="chip"
                  onClick={() => onAlignShape(selectedShape.id, 'h')}
                >
                  Közép X
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onAlignShape(selectedShape.id, 'v')}
                >
                  Közép Y
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onAlignShape(selectedShape.id, 'c')}
                >
                  Közép
                </button>
              </div>
              <div className="align-row">
                <button
                  type="button"
                  className="chip"
                  onClick={() => onReorderShape(selectedShape.id, -1)}
                >
                  Hátrébb
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onReorderShape(selectedShape.id, 1)}
                >
                  Előrébb
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onReorderShape(selectedShape.id, 'back')}
                >
                  {t('controls.toBack')}
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onReorderShape(selectedShape.id, 'front')}
                >
                  {t('controls.toFront')}
                </button>
              </div>
              <div className="align-row">
                <button
                  type="button"
                  className="chip"
                  onClick={() =>
                    onUpdateShape(selectedShape.id, {
                      rotation: ((selectedShape.rotation + 180 + 180) % 360) - 180,
                    })
                  }
                >
                  {t('controls.flip')}
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onDuplicateShape(selectedShape.id)}
                >
                  Duplikál
                </button>
              </div>
              <button
                type="button"
                className="linkish danger"
                onClick={() => onRemoveShape(selectedShape.id)}
              >
                Forma törlése
              </button>
            </div>
            </CollapsibleSection>
          )}
        </>
      )}

      {state.activeTab === 'text' && (
        <>
          <CollapsibleSection title={t('controls.textLayers')} storageKey="ctrl-textLayers">
          <button type="button" className="chip add-wide" onClick={addText}>
            + Új szöveg
          </button>

          <div className="shape-list">
            {state.texts.map((t) => (
              <button
                key={t.id}
                type="button"
                className={
                  selectedText?.id === t.id
                    ? 'shape-item shape-item-active'
                    : 'shape-item'
                }
                onClick={() =>
                  onChange({ selected: { type: 'text', id: t.id } })
                }
              >
                <span
                  className="shape-swatch"
                  style={{ background: t.color }}
                  aria-hidden
                />
                {t.label}
              </button>
            ))}
          </div>
          </CollapsibleSection>

          {selectedText && (
            <CollapsibleSection
              title={selectedText.label || t('controls.text')}
              storageKey="ctrl-textEdit"
              defaultOpen
            >
              <div className="shape-editor">
              <label className="field">
                <span>{t('controls.layerName')}</span>
                <input
                  type="text"
                  value={selectedText.label}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, { label: e.target.value })
                  }
                />
              </label>
              <label className="field">
                <span>{t('controls.text')}</span>
                <input
                  type="text"
                  value={selectedText.text}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, { text: e.target.value })
                  }
                />
              </label>

              {(
                Object.keys(FONT_GROUP_LABELS) as Array<
                  keyof typeof FONT_GROUP_LABELS
                >
              ).map((group) => {
                const fonts = FONTS.filter((f) => f.group === group)
                if (!fonts.length) return null
                return (
                  <div key={group} className="font-group">
                    <p className="shape-group-label">
                      {FONT_GROUP_LABELS[group]}
                    </p>
                    <div className="font-row">
                      {fonts.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          className={
                            selectedText.font === f.id
                              ? 'font-chip font-chip-active'
                              : 'font-chip'
                          }
                          style={{ fontFamily: f.family }}
                          onClick={() =>
                            onUpdateText(selectedText.id, { font: f.id })
                          }
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              <label className="field">
                <span>{t('controls.color')}</span>
                <input
                  type="color"
                  value={selectedText.color}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, { color: e.target.value })
                  }
                />
              </label>
              <label className="field">
                <span>Méret · {selectedText.size}px</span>
                <input
                  type="range"
                  min={16}
                  max={240}
                  value={selectedText.size}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      size: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>
                  Vastagság ·{' '}
                  {selectedText.weight > 0 ? selectedText.weight : 'auto'}
                </span>
                <input
                  type="range"
                  min={0}
                  max={900}
                  step={100}
                  value={selectedText.weight}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      weight: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>
                  Átlátszóság · {Math.round(selectedText.opacity * 100)}%
                </span>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(selectedText.opacity * 100)}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      opacity: Number(e.target.value) / 100,
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Betűköz · {selectedText.letterSpacing}px</span>
                <input
                  type="range"
                  min={-4}
                  max={40}
                  value={selectedText.letterSpacing}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      letterSpacing: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Forgatás · {Math.round(selectedText.rotation)}°</span>
                <input
                  type="range"
                  min={-45}
                  max={45}
                  value={selectedText.rotation}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      rotation: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>X · {Math.round(selectedText.x)}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selectedText.x}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      x: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Y · {Math.round(selectedText.y)}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={selectedText.y}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      y: Number(e.target.value),
                    })
                  }
                />
              </label>

              <div className="align-row">
                {(['left', 'center', 'right'] as Align[]).map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={
                      selectedText.align === a ? 'chip chip-active' : 'chip'
                    }
                    onClick={() =>
                      onUpdateText(selectedText.id, { align: a })
                    }
                  >
                    {a === 'left' ? 'Bal' : a === 'center' ? 'Közép' : 'Jobb'}
                  </button>
                ))}
              </div>

              <div className="check-grid">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={selectedText.uppercase}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        uppercase: e.target.checked,
                      })
                    }
                  />
                  NAGYBETŰS
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={selectedText.italic}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        italic: e.target.checked,
                      })
                    }
                  />
                  Dőlt
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={selectedText.underline}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        underline: e.target.checked,
                      })
                    }
                  />
                  Aláhúzás
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={selectedText.stroke}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        stroke: e.target.checked,
                      })
                    }
                  />
                  Kontúr
                </label>
              </div>
              {selectedText.stroke && (
                <div className="field-row">
                  <label className="field">
                    <span>{t('controls.strokeColor')}</span>
                    <input
                      type="color"
                      value={selectedText.strokeColor}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          strokeColor: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>{selectedText.strokeWidth}px</span>
                    <input
                      type="range"
                      min={2}
                      max={28}
                      value={selectedText.strokeWidth}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          strokeWidth: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
              )}
              <label className="check">
                <input
                  type="checkbox"
                  checked={selectedText.shadow}
                  onChange={(e) =>
                    onUpdateText(selectedText.id, {
                      shadow: e.target.checked,
                    })
                  }
                />
                Árnyék
              </label>
              {selectedText.shadow && (
                <>
                  <label className="field">
                    <span>Blur · {selectedText.shadowBlur}px</span>
                    <input
                      type="range"
                      min={0}
                      max={60}
                      value={selectedText.shadowBlur}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          shadowBlur: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Offset Y · {selectedText.shadowOffsetY}px</span>
                    <input
                      type="range"
                      min={-20}
                      max={40}
                      value={selectedText.shadowOffsetY}
                      onChange={(e) =>
                        onUpdateText(selectedText.id, {
                          shadowOffsetY: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </>
              )}

              <div className="align-row">
                <button
                  type="button"
                  className="chip"
                  onClick={() => onReorderText(selectedText.id, -1)}
                >
                  Hátrébb
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onReorderText(selectedText.id, 1)}
                >
                  Előrébb
                </button>
                <button
                  type="button"
                  className="chip"
                  onClick={() => onDuplicateText(selectedText.id)}
                >
                  Duplikál
                </button>
              </div>
              {state.texts.length > 1 && (
                <button
                  type="button"
                  className="linkish danger"
                  onClick={() => onRemoveText(selectedText.id)}
                >
                  Szöveg törlése
                </button>
              )}
            </div>
            </CollapsibleSection>
          )}
        </>
      )}

      {state.activeTab === 'fx' && (
        <>
          <CollapsibleSection title={t('controls.colorGrade')} storageKey="ctrl-colorGrade">
            <label className="field">
              <span>Fényerő · {state.brightness}%</span>
              <input
                type="range"
                min={50}
                max={150}
                value={state.brightness}
                onChange={(e) =>
                  onChange({ brightness: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Kontraszt · {state.contrast}%</span>
              <input
                type="range"
                min={50}
                max={160}
                value={state.contrast}
                onChange={(e) =>
                  onChange({ contrast: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Telítettség · {state.saturate}%</span>
              <input
                type="range"
                min={0}
                max={200}
                value={state.saturate}
                onChange={(e) =>
                  onChange({ saturate: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Hue · {state.hueRotate}°</span>
              <input
                type="range"
                min={0}
                max={360}
                value={state.hueRotate}
                onChange={(e) =>
                  onChange({ hueRotate: Number(e.target.value) })
                }
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={state.invert}
                onChange={(e) => onChange({ invert: e.target.checked })}
              />
              Invertálás
            </label>
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.vignette')} storageKey="ctrl-vignette">
            <label className="field">
              <span>Vignette · {Math.round(state.vignette * 100)}%</span>
              <input
                type="range"
                min={0}
                max={80}
                value={Math.round(state.vignette * 100)}
                onChange={(e) =>
                  onChange({ vignette: Number(e.target.value) / 100 })
                }
              />
            </label>
            <label className="field">
              <span>Glow · {Math.round(state.glow * 100)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.glow * 100)}
                onChange={(e) =>
                  onChange({ glow: Number(e.target.value) / 100 })
                }
              />
            </label>
            {state.glow > 0 && (
              <>
                <label className="field">
                  <span>{t('controls.glowColor')}</span>
                  <input
                    type="color"
                    value={state.glowColor}
                    onChange={(e) =>
                      onChange({ glowColor: e.target.value })
                    }
                  />
                </label>
                <label className="field">
                  <span>Glow X · {state.glowX}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={state.glowX}
                    onChange={(e) =>
                      onChange({ glowX: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>Glow Y · {state.glowY}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={state.glowY}
                    onChange={(e) =>
                      onChange({ glowY: Number(e.target.value) })
                    }
                  />
                </label>
              </>
            )}
            <label className="field">
              <span>Spotlight · {Math.round(state.spotlight * 100)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.spotlight * 100)}
                onChange={(e) =>
                  onChange({ spotlight: Number(e.target.value) / 100 })
                }
              />
            </label>
            {state.spotlight > 0 && (
              <>
                <label className="field">
                  <span>Spotlight X · {state.spotlightX}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={state.spotlightX}
                    onChange={(e) =>
                      onChange({ spotlightX: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>Spotlight Y · {state.spotlightY}%</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={state.spotlightY}
                    onChange={(e) =>
                      onChange({ spotlightY: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>Méret · {state.spotlightSize}%</span>
                  <input
                    type="range"
                    min={20}
                    max={90}
                    value={state.spotlightSize}
                    onChange={(e) =>
                      onChange({ spotlightSize: Number(e.target.value) })
                    }
                  />
                </label>
              </>
            )}
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.texture')} storageKey="ctrl-texture">
            <label className="field">
              <span>Grain · {Math.round(state.grain * 100)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.grain * 100)}
                onChange={(e) =>
                  onChange({ grain: Number(e.target.value) / 100 })
                }
              />
            </label>
            <label className="field">
              <span>Scanline · {Math.round(state.scanlines * 100)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.scanlines * 100)}
                onChange={(e) =>
                  onChange({ scanlines: Number(e.target.value) / 100 })
                }
              />
            </label>
            <label className="field">
              <span>Csíkok · {Math.round(state.stripes * 100)}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.stripes * 100)}
                onChange={(e) =>
                  onChange({ stripes: Number(e.target.value) / 100 })
                }
              />
            </label>
            {state.stripes > 0 && (
              <>
                <label className="field">
                  <span>{t('controls.stripeColor')}</span>
                  <input
                    type="color"
                    value={state.stripeColor}
                    onChange={(e) =>
                      onChange({ stripeColor: e.target.value })
                    }
                  />
                </label>
                <label className="field">
                  <span>Szög · {state.stripeAngle}°</span>
                  <input
                    type="range"
                    min={-90}
                    max={90}
                    value={state.stripeAngle}
                    onChange={(e) =>
                      onChange({ stripeAngle: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>Sűrűség · {state.stripeGap}px</span>
                  <input
                    type="range"
                    min={16}
                    max={120}
                    value={state.stripeGap}
                    onChange={(e) =>
                      onChange({ stripeGap: Number(e.target.value) })
                    }
                  />
                </label>
              </>
            )}
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.frame')} storageKey="ctrl-frame">
            <label className="field">
              <span>
                Letterbox · {Math.round(state.letterbox * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={30}
                value={Math.round(state.letterbox * 100)}
                onChange={(e) =>
                  onChange({ letterbox: Number(e.target.value) / 100 })
                }
              />
            </label>
            <label className="field">
              <span>Lekerekített sarkok · {state.roundedCorners}px</span>
              <input
                type="range"
                min={0}
                max={80}
                value={state.roundedCorners}
                onChange={(e) =>
                  onChange({ roundedCorners: Number(e.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Háttérkép blur · {state.bgBlur}px</span>
              <input
                type="range"
                min={0}
                max={24}
                value={state.bgBlur}
                onChange={(e) =>
                  onChange({ bgBlur: Number(e.target.value) })
                }
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={state.frameEnabled}
                onChange={(e) =>
                  onChange({ frameEnabled: e.target.checked })
                }
              />
              Keret bekapcsolása
            </label>
            {state.frameEnabled && (
              <>
                <label className="field">
                  <span>{t('controls.color')}</span>
                  <input
                    type="color"
                    value={state.frameColor}
                    onChange={(e) =>
                      onChange({ frameColor: e.target.value })
                    }
                  />
                </label>
                <label className="field">
                  <span>Vastagság · {state.frameWidth}px</span>
                  <input
                    type="range"
                    min={4}
                    max={48}
                    value={state.frameWidth}
                    onChange={(e) =>
                      onChange({ frameWidth: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="field">
                  <span>Beljebb · {state.frameInset}px</span>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={state.frameInset}
                    onChange={(e) =>
                      onChange({ frameInset: Number(e.target.value) })
                    }
                  />
                </label>
              </>
            )}
          </CollapsibleSection>

          <CollapsibleSection title={t('controls.grid')} storageKey="ctrl-grid">
            <label className="check">
              <input
                type="checkbox"
                checked={state.showGrid}
                onChange={(e) => onChange({ showGrid: e.target.checked })}
              />
              {t('controls.showGrid')}
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={state.snapToGrid}
                onChange={(e) => onChange({ snapToGrid: e.target.checked })}
              />
              {t('controls.snapGrid')}
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={state.centerGuides}
                onChange={(e) => onChange({ centerGuides: e.target.checked })}
              />
              {t('controls.centerGuides')}
            </label>
            <label className="field">
              <span>
                {t('controls.gridSize')} · {state.gridSize}px
              </span>
              <input
                type="range"
                min={16}
                max={160}
                step={8}
                value={state.gridSize}
                onChange={(e) =>
                  onChange({ gridSize: Number(e.target.value) })
                }
              />
            </label>
            <div className="align-row">
              {[32, 64, 80, 128].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    state.gridSize === size ? 'chip chip-active' : 'chip'
                  }
                  onClick={() =>
                    onChange({ gridSize: size, showGrid: true, snapToGrid: true })
                  }
                >
                  {size}px
                </button>
              ))}
            </div>
            <label className="field">
              <span>
                {t('controls.gridOpacity')} ·{' '}
                {Math.round(state.gridOpacity * 100)}%
              </span>
              <input
                type="range"
                min={10}
                max={80}
                value={Math.round(state.gridOpacity * 100)}
                onChange={(e) =>
                  onChange({ gridOpacity: Number(e.target.value) / 100 })
                }
              />
            </label>
          </CollapsibleSection>

          {state.kind === 'banner' && (
            <CollapsibleSection title={t('controls.banner')} storageKey="ctrl-banner">
              <label className="check">
                <input
                  type="checkbox"
                  checked={state.showSafeArea}
                  onChange={(e) =>
                    onChange({ showSafeArea: e.target.checked })
                  }
                />
                {t('controls.showSafe')}
              </label>
            </CollapsibleSection>
          )}
        </>
      )}

      {exportError && (
        <p className="export-error">{te(exportError)}</p>
      )}

      <button
        type="button"
        className="export-btn"
        onClick={onExport}
        disabled={exporting}
      >
        {exporting ? t('editor.exporting') : t('files.exportPng')}
      </button>
    </aside>
  )
}
