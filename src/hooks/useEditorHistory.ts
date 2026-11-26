import { useCallback, useRef, useState } from 'react'
import type { EditorState } from '../types'

function cloneState(state: EditorState): EditorState {
  return structuredClone(state)
}

const MAX = 60

export function useEditorHistory(initial: EditorState) {
  const [state, setState] = useState(initial)
  const undoStack = useRef<EditorState[]>([])
  const redoStack = useRef<EditorState[]>([])
  const dragSnapshot = useRef<EditorState | null>(null)

  const commit = useCallback(
    (updater: EditorState | ((prev: EditorState) => EditorState)) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        if (next === prev) return prev
        undoStack.current.push(cloneState(prev))
        if (undoStack.current.length > MAX) undoStack.current.shift()
        redoStack.current = []
        return next
      })
    },
    [],
  )

  /** Live update without history (drag / resize). */
  const replace = useCallback(
    (updater: EditorState | ((prev: EditorState) => EditorState)) => {
      setState(updater)
    },
    [],
  )

  const beginGesture = useCallback(() => {
    dragSnapshot.current = cloneState(state)
  }, [state])

  const endGesture = useCallback(() => {
    if (!dragSnapshot.current) return
    undoStack.current.push(dragSnapshot.current)
    if (undoStack.current.length > MAX) undoStack.current.shift()
    redoStack.current = []
    dragSnapshot.current = null
  }, [])

  const undo = useCallback(() => {
    setState((prev) => {
      const last = undoStack.current.pop()
      if (!last) return prev
      redoStack.current.push(cloneState(prev))
      return last
    })
  }, [])

  const redo = useCallback(() => {
    setState((prev) => {
      const next = redoStack.current.pop()
      if (!next) return prev
      undoStack.current.push(cloneState(prev))
      return next
    })
  }, [])

  const canUndo = () => undoStack.current.length > 0
  const canRedo = () => redoStack.current.length > 0

  const resetHistory = useCallback((next: EditorState) => {
    undoStack.current = []
    redoStack.current = []
    dragSnapshot.current = null
    setState(next)
  }, [])

  return {
    state,
    setState,
    commit,
    replace,
    beginGesture,
    endGesture,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  }
}
