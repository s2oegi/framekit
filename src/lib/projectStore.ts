import type { ProjectKind } from '../presets'
import type { EditorState } from '../types'

export type SavedProject = {
  id: string
  name: string
  kind: ProjectKind
  ownerId: string | null
  updatedAt: string
  createdAt: string
  state: EditorState
}

const PROJECTS_KEY = 'framekit.projects.v1'

function readAll(): SavedProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedProject[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(projects: SavedProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function listProjects(ownerId: string | null) {
  const all = readAll()
  if (!ownerId) {
    return all
      .filter((p) => p.ownerId == null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }
  return all
    .filter((p) => p.ownerId === ownerId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export function getProject(id: string) {
  return readAll().find((p) => p.id === id) ?? null
}

export function saveProject(input: {
  id?: string
  name: string
  kind: ProjectKind
  ownerId: string | null
  state: EditorState
}): SavedProject {
  const all = readAll()
  const now = new Date().toISOString()
  const name = input.name.trim() || 'Névtelen projekt'

  // Strip UI-only selection noise for cleaner saves
  const state: EditorState = {
    ...input.state,
    selected: null,
    backgroundImage: input.state.backgroundImage,
  }

  if (input.id) {
    const idx = all.findIndex((p) => p.id === input.id)
    if (idx >= 0) {
      const existing = all[idx]
      if (existing.ownerId && existing.ownerId !== input.ownerId) {
        throw new Error('files.noPermission')
      }
      const updated: SavedProject = {
        ...existing,
        name,
        kind: input.kind,
        ownerId: input.ownerId ?? existing.ownerId,
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

  const created: SavedProject = {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    kind: input.kind,
    ownerId: input.ownerId,
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

export function deleteProject(id: string, ownerId: string | null) {
  const all = readAll()
  const project = all.find((p) => p.id === id)
  if (!project) return
  if (project.ownerId && project.ownerId !== ownerId) {
    throw new Error('files.deleteDenied')
  }
  writeAll(all.filter((p) => p.id !== id))
}

export function exportProjectFile(project: SavedProject) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}.framekit.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importProjectFile(file: File): Promise<SavedProject> {
  const text = await file.text()
  const data = JSON.parse(text) as Partial<SavedProject>
  if (!data.state || !data.kind) {
    throw new Error('files.invalidFile')
  }
  return {
    id: data.id ?? `proj-import-${Date.now()}`,
    name: data.name ?? file.name.replace(/\.framekit\.json$/i, ''),
    kind: data.kind,
    ownerId: null,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: data.state,
  }
}
