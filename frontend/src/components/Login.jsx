import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import services from "../services";
import Spinner from "./Spinner";

function Login({ onLoginScreen, onAuthSuccess }) {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState({
    username: "",
    password: "",
  });
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState("");
  const { username, password } = textInput;

  const handleTextInputChange = ({ target: { name, value } }) => {
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(""); // Clear error when typing
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setReadOnly(true);
    setError("");

    try {
      await services.auth.getCsrf();
      const authPromise = onLoginScreen
        ? services.auth.login({ username, password })
        : services.auth.signup({ username, password });

      const resp = await authPromise;
      onAuthSuccess(resp.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please try again.");
      setReadOnly(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md px-4">
        <div className="light-card p-10 shadow-xl shadow-slate-200/50">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {onLoginScreen ? "Sign In" : "Join Us"}
            </h2>
            <p className="text-slate-500 mt-2">
              {onLoginScreen ? "Access your personal dashboard" : "Create a new account today"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
              <input
                type="text"
                name="username"
                className="input-field disabled:opacity-50"
                placeholder="Your username"
                value={username}
                readOnly={readOnly}
                disabled={readOnly}
                onChange={handleTextInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                name="password"
                className="input-field disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                readOnly={readOnly}
                disabled={readOnly}
                onChange={handleTextInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg shadow-md hover:shadow-xl transition-all disabled:animate-pulse"
              disabled={readOnly}
            >
              {readOnly ? "Processing..." : onLoginScreen ? "Continue" : "Register"}
            </button>

            <div className="pt-6 text-center border-t border-slate-100">
              <span className="text-slate-500 text-sm">
                {onLoginScreen ? "Need an account? " : "Already have an account? "}
              </span>
              <Link
                to={onLoginScreen ? "/signup" : "/login"}
                className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
              >
                {onLoginScreen ? "Register now" : "Log in here"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
