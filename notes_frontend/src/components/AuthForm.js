import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Authentication form for sign in or register.
 * @param {Object} props
 * @param {string} props.mode - "signin" or "register"
 * @param {Function} props.onSubmit - Called with {email, password}
 * @param {string} [props.error] - Optional error message
 */
function AuthForm({ mode, onSubmit, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (email && password) {
      onSubmit({ email, password });
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{mode === "register" ? "Register" : "Sign In"}</h2>
      <label>
        Email
        <input
          type="email"
          autoFocus
          value={email}
          required
          autoComplete="username"
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          required
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <button className="btn btn-primary" type="submit">
        {mode === "register" ? "Register" : "Sign In"}
      </button>
      {error && <div className="auth-error">{error}</div>}
    </form>
  );
}

export default AuthForm;
