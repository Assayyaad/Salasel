'use client'

import { useEffect } from 'react'
import { importNotesFromExtension, NOTES_UPDATED_EVENT } from '@/app/store/useNotesStore'

/**
 * Bridges the Salasel browser extension's notes handoff into the app store.
 *
 * - On mount, reads localStorage["salasel-notes-inbox"] once.
 * - Listens for the extension's `salasel:notes-updated` CustomEvent to re-import
 *   while the tab is open (the native `storage` event does not fire same-tab).
 *
 * Renders nothing. Idle and silent when the extension is not installed.
 */
const NotesInbox: React.FC = () => {
  useEffect(() => {
    importNotesFromExtension()

    const handler = () => importNotesFromExtension()
    window.addEventListener(NOTES_UPDATED_EVENT, handler)
    return () => window.removeEventListener(NOTES_UPDATED_EVENT, handler)
  }, [])

  return null
}

export default NotesInbox
