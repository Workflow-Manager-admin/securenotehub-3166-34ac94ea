import React from "react";

/**
 * PUBLIC_INTERFACE
 * Navbar component. Displays app title, user controls, and light/dark mode toggle.
 * @param {Object} props
 * @param {string} props.userEmail - Authenticated user's email (if signed in).
 * @param {Function} props.onLogout - Function to handle logout.
 * @param {string} props.theme - Current theme ("light" or "dark").
 * @param {Function} props.onToggleTheme - Function to toggle theme.
 */
function Navbar({ userEmail, onLogout, theme, onToggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-title">SecureNoteHub</div>
      <div className="navbar-actions">
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {userEmail && (
          <span className="navbar-user">
            {userEmail}
            <button className="btn btn-logout" onClick={onLogout}>
              Logout
            </button>
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
