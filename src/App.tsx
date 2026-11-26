import { useState } from 'react'
import type { ProjectKind } from './presets'
import {
  getSession,
  logoutUser,
  setSession as persistSession,
  type Session,
} from './lib/authStore'
import type { SavedProject } from './lib/projectStore'
import { AuthModal } from './components/AuthModal'
import { Editor } from './components/Editor'
import { ModeSelect } from './components/ModeSelect'
import { VideoEditor } from './components/video/VideoEditor'

type AppScreen =
  | { type: 'home' }
  | { type: 'design'; kind: ProjectKind; project: SavedProject | null }
  | { type: 'video' }

function App() {
  const [screen, setScreen] = useState<AppScreen>({ type: 'home' })
  const [session, setSessionState] = useState<Session | null>(() =>
    getSession(),
  )
  const [authOpen, setAuthOpen] = useState(false)

  function handleSession(next: Session | null) {
    if (next) persistSession(next)
    else logoutUser()
    setSessionState(next)
  }

  function openProject(project: SavedProject) {
    setScreen({ type: 'design', kind: project.kind, project })
  }

  if (screen.type === 'home') {
    return (
      <>
        <ModeSelect
          session={session}
          onSelectDesign={(kind) =>
            setScreen({ type: 'design', kind, project: null })
          }
          onSelectVideo={() => setScreen({ type: 'video' })}
          onOpenAuth={() => setAuthOpen(true)}
          onLogout={() => handleSession(null)}
          onOpenProject={openProject}
        />
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onAuthed={handleSession}
        />
      </>
    )
  }

  if (screen.type === 'video') {
    return <VideoEditor onBack={() => setScreen({ type: 'home' })} />
  }

  return (
    <Editor
      key={screen.project?.id ?? `new-${screen.kind}`}
      kind={screen.kind}
      session={session}
      onSession={handleSession}
      initialProject={screen.project}
      onBack={() => setScreen({ type: 'home' })}
    />
  )
}

export default App
