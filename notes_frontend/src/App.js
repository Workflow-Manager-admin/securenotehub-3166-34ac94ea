import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import AuthForm from "./components/AuthForm";
import {
  apiSignIn,
  apiRegister,
  apiGetNotes,
  apiCreateNote,
  apiUpdateNote,
  apiDeleteNote,
} from "./api";

const LOCAL_STORAGE_TOKEN_KEY = "securenotehub_token";
const LOCAL_STORAGE_EMAIL_KEY = "securenotehub_email";

// PUBLIC_INTERFACE
function App() {
  // Theme state
  const [theme, setTheme] = useState("light");
  // Auth state
  const [token, setToken] = useState(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || "");
  const [userEmail, setUserEmail] = useState(localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY) || "");
  const [authMode, setAuthMode] = useState("signin"); // or 'register'
  const [authError, setAuthError] = useState("");

  // Notes state
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [noteOperationError, setNoteOperationError] = useState("");

  // Effect: apply theme to html
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Effect: load notes after auth
  useEffect(() => {
    if (token) {
      setLoadingNotes(true);
      apiGetNotes(token)
        .then((fetchedNotes) => {
          // Sort most recent first
          setNotes([...fetchedNotes].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
          setLoadingNotes(false);
        })
        .catch(() => {
          setNotes([]);
          setLoadingNotes(false);
        });
    } else {
      setNotes([]);
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Sign in
  const handleSignIn = async ({ email, password }) => {
    setAuthError("");
    try {
      const resp = await apiSignIn(email, password);
      setToken(resp.token);
      setUserEmail(email);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, resp.token);
      localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, email);
    } catch (e) {
      setAuthError(e.message || "Failed to sign in.");
    }
  };

  // Register
  const handleRegister = async ({ email, password }) => {
    setAuthError("");
    try {
      const resp = await apiRegister(email, password);
      setToken(resp.token);
      setUserEmail(email);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, resp.token);
      localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, email);
    } catch (e) {
      setAuthError(e.message || "Failed to register.");
    }
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    setUserEmail("");
    setSelectedNoteId(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
  };

  // Select note
  const handleSelectNote = (noteId) => setSelectedNoteId(noteId);

  // Create new note
  const handleNewNote = async () => {
    if (!token) return;
    setNoteOperationError("");
    try {
      const newNote = await apiCreateNote({ title: "", content: "" }, token);
      setNotes((old) => [newNote, ...old]);
      setSelectedNoteId(newNote.id);
    } catch (e) {
      setNoteOperationError(`Could not create note: ${e.message}`);
    }
  };

  // Update note
  const handleSaveNote = async (notePatch) => {
    if (!token) return;
    setNoteOperationError("");
    try {
      let updated;
      if (notePatch.id) {
        // Update existing
        updated = await apiUpdateNote(notePatch.id, notePatch, token);
        setNotes((old) =>
          old.map((note) => (note.id === updated.id ? updated : note))
        );
      } else {
        // Should not hit, normally create is via "new note"
        updated = await apiCreateNote(notePatch, token);
        setNotes((old) => [updated, ...old]);
      }
      setSelectedNoteId(updated.id);
    } catch (e) {
      setNoteOperationError(`Could not save note: ${e.message}`);
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (!token) return;
    setNoteOperationError("");
    try {
      await apiDeleteNote(noteId, token);
      setNotes((old) => old.filter((n) => n.id !== noteId));
      setSelectedNoteId(null);
    } catch (e) {
      setNoteOperationError(`Could not delete note: ${e.message}`);
    }
  };

  // Find selected note
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // Auth view
  if (!token) {
    return (
      <div className="App app-centered">
        <Navbar
          userEmail={null}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="auth-panel">
          <AuthForm
            mode={authMode}
            error={authError}
            onSubmit={authMode === "signin" ? handleSignIn : handleRegister}
          />
          <button
            className="btn btn-secondary auth-switch-btn"
            onClick={() => setAuthMode(authMode === "signin" ? "register" : "signin")}
          >
            {authMode === "signin"
              ? "Don't have an account? Register"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    );
  }

  // Main app view
  return (
    <div className="App">
      <Navbar
        userEmail={userEmail}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="app-main-layout">
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelect={handleSelectNote}
          onNewNote={handleNewNote}
        />
        <main className="main-content">
          {loadingNotes ? (
            <div className="loading">Loading notes…</div>
          ) : noteOperationError ? (
            <div className="error">{noteOperationError}</div>
          ) : (
            <NoteEditor
              note={selectedNote}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
