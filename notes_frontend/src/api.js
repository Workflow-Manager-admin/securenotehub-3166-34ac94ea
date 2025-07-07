const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000"; // Set this to FastAPI backend URL

// API utils for authentication and notes
// PUBLIC_INTERFACE
export async function apiSignIn(email, password) {
  /** Sign in and receive auth token */
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  if (!res.ok) throw new Error("Invalid email or password");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiRegister(email, password) {
  /** Register a new account */
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email, password})
  });
  if (!res.ok) throw new Error("Registration failed");
  return await res.json(); // expected to include token
}

// PUBLIC_INTERFACE
export async function apiGetNotes(token) {
  /** Get all notes for logged-in user (auth required) */
  const res = await fetch(`${API_BASE}/notes`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiCreateNote(note, token) {
  /** Create a new note (auth required) */
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiUpdateNote(noteId, note, token) {
  /** Update a note by ID */
  const res = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiDeleteNote(noteId, token) {
  /** Delete a note by ID */
  const res = await fetch(`${API_BASE}/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return true;
}
