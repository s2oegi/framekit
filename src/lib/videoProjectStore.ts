import {
  emptyVideoProject,
  type BrollClip,
  type VideoClip,
  type VideoProject,
  type VideoSource,
  type VideoTextOverlay,
} from '../video/types'

const DB_NAME = 'framekit.video.v1'
const DB_VERSION = 1
const META_STORE = 'projects'
const BLOB_STORE = 'blobs'

export type VideoProjectMeta = {
  id: string
  name: string
  updatedAt: string
  createdAt: string
  sourceMeta: { id: string; name: string; duration: number }[]
  clips: VideoClip[]
  broll: BrollClip[]
  texts: VideoTextOverlay[]
  markIn: number | null
  markOut: number | null
  snap: boolean
  zoom: number
  masterVolume: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('video.dbOpenFailed'))
  })
}

function idbReq<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('video.dbError'))
  })
}

export async function listVideoProjects(): Promise<
  { id: string; name: string; updatedAt: string; createdAt: string }[]
> {
  const db = await openDb()
  try {
    const tx = db.transaction(META_STORE, 'readonly')
    const all = await idbReq(tx.objectStore(META_STORE).getAll())
    return (all as VideoProjectMeta[])
      .map((p) => ({
        id: p.id,
        name: p.name,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } finally {
    db.close()
  }
}

export async function saveVideoProject(
  project: VideoProject,
): Promise<VideoProject> {
  const db = await openDb()
  const now = new Date().toISOString()
  const id =
    project.projectId ??
    `vproj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const name = project.projectName.trim() || 'Untitled video'

  const meta: VideoProjectMeta = {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    sourceMeta: project.sources.map((s) => ({
      id: s.id,
      name: s.name,
      duration: s.duration,
    })),
    clips: project.clips.map((c) => ({
      ...c,
      transition: { ...c.transition },
    })),
    broll: project.broll.map((c) => ({ ...c })),
    texts: project.texts.map((t) => ({ ...t })),
    markIn: project.markIn,
    markOut: project.markOut,
    snap: project.snap,
    zoom: project.zoom,
    masterVolume: project.masterVolume,
  }

  try {
    // Preserve createdAt if updating
    const existing = await idbReq<VideoProjectMeta | undefined>(
      db.transaction(META_STORE, 'readonly').objectStore(META_STORE).get(id),
    )
    if (existing?.createdAt) meta.createdAt = existing.createdAt

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([META_STORE, BLOB_STORE], 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('files.storageFull'))
      tx.objectStore(META_STORE).put(meta)
      const blobs = tx.objectStore(BLOB_STORE)
      for (const src of project.sources) {
        blobs.put(src.blob, `${id}:${src.id}`)
      }
    })

    return {
      ...project,
      projectId: id,
      projectName: name,
    }
  } finally {
    db.close()
  }
}

export async function loadVideoProject(id: string): Promise<VideoProject> {
  const db = await openDb()
  try {
    const meta = await idbReq<VideoProjectMeta | undefined>(
      db.transaction(META_STORE, 'readonly').objectStore(META_STORE).get(id),
    )
    if (!meta) throw new Error('video.projectNotFound')

    const sources: VideoSource[] = []
    for (const sm of meta.sourceMeta) {
      const blob = await idbReq<Blob | undefined>(
        db
          .transaction(BLOB_STORE, 'readonly')
          .objectStore(BLOB_STORE)
          .get(`${id}:${sm.id}`),
      )
      if (!blob) throw new Error('video.blobMissing')
      sources.push({
        id: sm.id,
        name: sm.name,
        duration: sm.duration,
        blob,
        objectUrl: URL.createObjectURL(blob),
      })
    }

    const base = emptyVideoProject()
    return {
      ...base,
      projectId: meta.id,
      projectName: meta.name,
      sources,
      clips: meta.clips,
      broll: meta.broll ?? [],
      texts: meta.texts ?? [],
      markIn: meta.markIn,
      markOut: meta.markOut,
      snap: meta.snap,
      zoom: meta.zoom,
      masterVolume: meta.masterVolume,
      selected: meta.clips[0] ? { type: 'clip', id: meta.clips[0].id } : null,
      playhead: 0,
      isPlaying: false,
    }
  } finally {
    db.close()
  }
}

export async function deleteVideoProject(id: string): Promise<void> {
  const db = await openDb()
  try {
    const meta = await idbReq<VideoProjectMeta | undefined>(
      db.transaction(META_STORE, 'readonly').objectStore(META_STORE).get(id),
    )
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([META_STORE, BLOB_STORE], 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('video.dbError'))
      tx.objectStore(META_STORE).delete(id)
      if (meta) {
        for (const sm of meta.sourceMeta) {
          tx.objectStore(BLOB_STORE).delete(`${id}:${sm.id}`)
        }
      }
    })
  } finally {
    db.close()
  }
}
