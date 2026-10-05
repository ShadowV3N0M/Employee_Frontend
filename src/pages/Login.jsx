import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import ThemeToggle from "../components/ThemeToggle";

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Flip State: false = Front (Sign in), true = Back (Register or Forgot Password)
  const [isFlipped, setIsFlipped] = useState(false);
  const [backMode, setBackMode] = useState("register"); // "register" | "forgot"

  // Front Form State (Login)
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  // Back Form State (Register / Forgot Password)
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [backError, setBackError] = useState("");
  const [backNotice, setBackNotice] = useState("");
  const [debugUrl, setDebugUrl] = useState("");
  const [backBusy, setBackBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoginError("");
    setLoginBusy(true);

    try {
      const { access_token } = await api.login(loginUsername, loginPassword);
      await signIn(access_token);
      navigate("/", { replace: true });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleBackSubmit(e) {
    e.preventDefault();
    setBackError("");
    setBackNotice("");
    setDebugUrl("");
    setBackBusy(true);

    try {
      if (backMode === "forgot") {
        const res = await api.forgotPassword(forgotUsername);
        setBackNotice(res.message);
        if (res.debug_url) {
          setDebugUrl(res.debug_url);
        }
      } else {
        const { access_token } = await api.register(regUsername, regPassword, regEmail);
        await signIn(access_token);
        navigate("/", { replace: true });
      }
    } catch (err) {
      setBackError(err.message);
    } finally {
      setBackBusy(false);
    }
  }

  function flipToRegister() {
    setBackMode("register");
    setBackError("");
    setBackNotice("");
    setDebugUrl("");
    if (loginUsername && !regUsername) {
      setRegUsername(loginUsername);
    }
    setShowRegPassword(false);
    setIsFlipped(true);
  }

  function flipToForgot() {
    setBackMode("forgot");
    setBackError("");
    setBackNotice("");
    setDebugUrl("");
    if (loginUsername && !forgotUsername) {
      setForgotUsername(loginUsername);
    }
    setIsFlipped(true);
  }

  function flipToLogin() {
    setLoginError("");
    setShowLoginPassword(false);
    setIsFlipped(false);
  }

  return (
    <div className="login-wrap">
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <ThemeToggle />
      </div>

      <div className="auth-flip-container">
        <div className={`auth-flip-card ${isFlipped ? "is-flipped" : ""}`}>
          
          {/* ==================== FRONT FACE: Sign In ==================== */}
          <form
            className="card auth-card-face auth-card-front"
            onSubmit={handleLoginSubmit}
            aria-hidden={isFlipped}
          >
            <div className="auth-card-content">
              <div>
                <h1>Employee Management</h1>
                <p className="muted">Sign in to continue</p>
              </div>

              {loginError && <div className="alert error">{loginError}</div>}

              <label>
                Username
                <input
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={isFlipped}
                  tabIndex={isFlipped ? -1 : 0}
                  autoFocus={!isFlipped}
                />
              </label>

              <label>
                Password
                <div className="password-input-wrap">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isFlipped}
                    tabIndex={isFlipped ? -1 : 0}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    disabled={isFlipped}
                    tabIndex={isFlipped ? -1 : 0}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    <PasswordToggleIcon visible={showLoginPassword} />
                  </button>
                </div>
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="link"
                  disabled={isFlipped}
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={flipToForgot}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="btn primary block"
                disabled={loginBusy || isFlipped}
                tabIndex={isFlipped ? -1 : 0}
              >
                {loginBusy ? "Please wait…" : "Sign in"}
              </button>
            </div>

            <div className="auth-card-footer">
              <p className="muted small">
                No account yet?{" "}
                <button
                  type="button"
                  className="flip-toggle-btn"
                  disabled={isFlipped}
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={flipToRegister}
                >
                  <span>Create Account</span>
                  <span className="flip-icon" aria-hidden="true">↻</span>
                </button>
              </p>
            </div>
          </form>

          {/* ==================== BACK FACE: Register / Forgot Password ==================== */}
          <form
            className="card auth-card-face auth-card-back"
            onSubmit={handleBackSubmit}
            aria-hidden={!isFlipped}
          >
            <div className="auth-card-content">
              <div>
                <h1>Employee Management</h1>
                <p className="muted">
                  {backMode === "register" ? "Create your account" : "Reset your password"}
                </p>
              </div>

              {backError && <div className="alert error">{backError}</div>}
              {backNotice && <div className="alert success">{backNotice}</div>}
              {debugUrl && (
                <div className="alert info" style={{ wordBreak: "break-all" }}>
                  <strong>Dev Reset Link:</strong><br />
                  <a href={debugUrl}>{debugUrl}</a>
                </div>
              )}

              {backMode === "register" ? (
                <>
                  <label>
                    Username
                    <input
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      autoComplete="username"
                      required
                      disabled={!isFlipped}
                      tabIndex={!isFlipped ? -1 : 0}
                    />
                  </label>

                  <label>
                    Email (optional)
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@example.com"
                      disabled={!isFlipped}
                      tabIndex={!isFlipped ? -1 : 0}
                    />
                  </label>

                  <label>
                    Password
                    <div className="password-input-wrap">
                      <input
                        type={showRegPassword ? "text" : "password"}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={!isFlipped}
                        tabIndex={!isFlipped ? -1 : 0}
                        placeholder="Choose a password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        disabled={!isFlipped}
                        tabIndex={!isFlipped ? -1 : 0}
                        aria-label={showRegPassword ? "Hide password" : "Show password"}
                        title={showRegPassword ? "Hide password" : "Show password"}
                      >
                        <PasswordToggleIcon visible={showRegPassword} />
                      </button>
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="btn primary block"
                    disabled={backBusy || !isFlipped}
                    tabIndex={!isFlipped ? -1 : 0}
                  >
                    {backBusy ? "Please wait…" : "Register"}
                  </button>

                  <p className="muted small">
                    New accounts start as plain users. An admin can promote you to manager or admin.
                  </p>
                </>
              ) : (
                <>
                  <label>
                    Username or Email
                    <input
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      autoComplete="username"
                      required
                      disabled={!isFlipped}
                      tabIndex={!isFlipped ? -1 : 0}
                    />
                  </label>

                  <button
                    type="submit"
                    className="btn primary block"
                    disabled={backBusy || !isFlipped}
                    tabIndex={!isFlipped ? -1 : 0}
                  >
                    {backBusy ? "Please wait…" : "Send Reset Link"}
                  </button>

                  <p className="muted small">
                    Enter your username or registered email address and we'll send password reset instructions.
                  </p>
                </>
              )}
            </div>

            <div className="auth-card-footer">
              <p className="muted small">
                {backMode === "register" ? (
                  <>
                    Already registered?{" "}
                    <button
                      type="button"
                      className="flip-toggle-btn"
                      disabled={!isFlipped}
                      tabIndex={!isFlipped ? -1 : 0}
                      onClick={flipToLogin}
                    >
                      <span>Sign in</span>
                      <span className="flip-icon" aria-hidden="true">↺</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="flip-toggle-btn"
                    disabled={!isFlipped}
                    tabIndex={!isFlipped ? -1 : 0}
                    onClick={flipToLogin}
                  >
                    <span className="flip-icon" aria-hidden="true">←</span>
                    <span>Back to Sign in</span>
                  </button>
                )}
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

function PasswordToggleIcon({ visible }) {
  if (visible) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
