import type { ProjectKind } from '../presets'
import { nextId, type EditorState } from '../types'

export type SavedTemplate = {
  id: string
  name: string
  description: string
  kind: ProjectKind
  accent: string
  createdAt: string
  updatedAt: string
  state: EditorState
}

const TEMPLATES_KEY = 'framekit.templates.v1'

function readAll(): SavedTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedTemplate[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(items: SavedTemplate[]) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(items))
}

export function listCustomTemplates(kind?: ProjectKind): SavedTemplate[] {
  const all = readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return kind ? all.filter((t) => t.kind === kind) : all
}

export function getCustomTemplate(id: string): SavedTemplate | null {
  return readAll().find((t) => t.id === id) ?? null
}

function cleanState(state: EditorState): EditorState {
  return {
    ...state,
    selected: null,
    shapes: state.shapes.map((s) => ({ ...s })),
    texts: state.texts.map((t) => ({ ...t })),
  }
}

export function rematerializeState(state: EditorState): EditorState {
  const cleaned = cleanState(state)
  return {
    ...cleaned,
    shapes: cleaned.shapes.map((s) => ({ ...s, id: nextId('shape') })),
    texts: cleaned.texts.map((t) => ({ ...t, id: nextId('text') })),
    selected: null,
  }
}

function pickAccent(state: EditorState): string {
  const shape = state.shapes.find((s) => s.fill && s.fill !== 'transparent')
  if (shape?.fill) return shape.fill
  if (state.useGradient) return state.backgroundColor2 || state.backgroundColor
  return state.backgroundColor || '#F5A524'
}

export function saveCustomTemplate(input: {
  id?: string
  name: string
  description?: string
  kind: ProjectKind
  state: EditorState
  accent?: string
}): SavedTemplate {
  const all = readAll()
  const now = new Date().toISOString()
  const name = input.name.trim() || 'Saját sablon'
  const description = (input.description ?? '').trim()
  const state = cleanState(input.state)
  const accent = input.accent?.trim() || pickAccent(state)

  if (input.id) {
    const idx = all.findIndex((t) => t.id === input.id)
    if (idx >= 0) {
      const updated: SavedTemplate = {
        ...all[idx],
        name,
        description,
        kind: input.kind,
        accent,
        updatedAt: now,
        state,
      }
      all[idx] = updated
      try {
        writeAll(all)
      } catch {
        throw new Error('files.storageFull')
      }
      return updated
    }
  }

  const created: SavedTemplate = {
    id: `tmpl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    description,
    kind: input.kind,
    accent,
    createdAt: now,
    updatedAt: now,
    state,
  }
  all.push(created)
  try {
    writeAll(all)
  } catch {
    throw new Error('files.storageFull')
  }
  return created
}

export function deleteCustomTemplate(id: string) {
  writeAll(readAll().filter((t) => t.id !== id))
}

export function renameCustomTemplate(id: string, name: string) {
  const all = readAll()
  const idx = all.findIndex((t) => t.id === id)
  if (idx < 0) throw new Error('templates.nameRequired')
  const trimmed = name.trim()
  if (!trimmed) throw new Error('templates.nameRequired')
  all[idx] = {
    ...all[idx],
    name: trimmed,
    updatedAt: new Date().toISOString(),
  }
  writeAll(all)
  return all[idx]
}
