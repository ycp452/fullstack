import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="nav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="btn-ghost">Home</Link>
            <Link to="/about" className="btn-ghost">About</Link>
            <Link to="/users" className="btn-ghost">Users</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
            <>
                <span className="text-sm text-slate-400 font-medium">{user.username}</span>
                <div className="h-4 w-px bg-slate-200"></div>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  Log out
                </button>
            </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors duration-200 px-4 py-1.5 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
