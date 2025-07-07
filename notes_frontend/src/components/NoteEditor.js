import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * Note editor/viewer component. Allows editing and saving the note.
 * @param {Object} props
 * @param {Object} props.note - The note object.
 * @param {Function} props.onSave - Save handler (updates or creates note).
 * @param {Function} props.onDelete - Delete handler.
 */
function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [editing, setEditing] = useState(Boolean(note && note.id));

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setEditing(Boolean(note && note.id));
  }, [note]);

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim() || content.trim()) {
      onSave({
        ...note,
        title: title.trim(),
        content,
      });
      setEditing(false);
    }
  };

  const handleEditClick = () => setEditing(true);

  if (!note) {
    return <div className="note-editor-empty">Select or create a note.</div>;
  }

  if (editing) {
    return (
      <form className="note-editor" onSubmit={handleSave}>
        <input
          className="note-title-input"
          type="text"
          placeholder="Title"
          value={title}
          maxLength={60}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="note-content-textarea"
          placeholder="Write your note here..."
          value={content}
          rows={12}
          onChange={e => setContent(e.target.value)}
        />
        <div className="note-editor-controls">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          {note.id && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => window.confirm("Delete this note?") && onDelete(note.id)}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    );
  }

  // Not editing: view mode
  return (
    <div className="note-view">
      <h2>{title || "(Untitled)"}</h2>
      <div className="note-date">
        {note.updated_at
          ? "Last updated " + new Date(note.updated_at).toLocaleString()
          : ""}
      </div>
      <div className="note-content">{content}</div>
      <button className="btn btn-primary" onClick={handleEditClick}>
        Edit
      </button>
    </div>
  );
}

export default NoteEditor;
