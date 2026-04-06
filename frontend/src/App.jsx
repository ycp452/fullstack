import { useEffect, useState } from "react";
import "./App.css";
import Users from "./components/Users";
import About from "./components/About";
import { Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import services from "./services";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    services.auth.getCsrf().then(() => {
      services.auth
        .me()
        .then((resp) => setUser(resp.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    });
  }, []);

  const handleLogout = async () => {
    try {
      await services.auth.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#fdfcf7]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-subtle-mesh"></div>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/about" element={<About user={user} />} />
          <Route path="/login" element={<Login onLoginScreen={true} onAuthSuccess={setUser} />} />
          <Route path="/signup" element={<Login onLoginScreen={false} onAuthSuccess={setUser} />} />
          <Route path="/users" element={<Users />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-32">
                <h2 className="text-6xl font-bold text-slate-200">404</h2>
                <p className="text-slate-400 mt-4 text-lg">Page not found</p>
                <Link to="/" className="mt-8 text-cyan-600 font-medium hover:underline underline-offset-4">Back to safety</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
