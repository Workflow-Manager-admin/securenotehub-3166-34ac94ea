import React from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar component. Shows notes list, highlights selected note, allows creating new note.
 * @param {Object} props
 * @param {Array} props.notes - Array of note objects.
 * @param {string} props.selectedNoteId - Currently selected note's ID.
 * @param {Function} props.onSelect - Callback to select a note.
 * @param {Function} props.onNewNote - Callback to create a new note.
 */
function Sidebar({ notes, selectedNoteId, onSelect, onNewNote }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div>My Notes</div>
        <button className="btn btn-accent sidebar-new-btn" onClick={onNewNote}>
          +
        </button>
      </div>
      <ul className="sidebar-notes-list">
        {notes && notes.length ? (
          notes.map(note => (
            <li
              key={note.id}
              className={
                note.id === selectedNoteId
                  ? "sidebar-note selected"
                  : "sidebar-note"
              }
              onClick={() => onSelect(note.id)}
              tabIndex={0}
              aria-label={`Select note titled ${note.title}`}
            >
              <div className="note-title">{note.title || "(Untitled)"}</div>
              <div className="note-date">
                {note.updated_at
                  ? new Date(note.updated_at).toLocaleDateString()
                  : ""}
              </div>
            </li>
          ))
        ) : (
          <li className="sidebar-empty">No notes yet</li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
