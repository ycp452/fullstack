import { useEffect, useState } from "react";
import services from "../services";

/**
 * @type {{
 *   id: number,
 *   username: string,
 * }[]}
 */
const initialUsers = [];

function Users() {
  const [allUsers, setAllUsers] = useState(initialUsers);
  const [fetchingAllUsers, setFetchingAllUsers] = useState(false);
  const [textInput, setTextInput] = useState({
    uid: "",
    username: "",
  });

  const fetchAllUsersAndSetState = () => {
    setFetchingAllUsers(true);
    services.user
      .getAll()
      .then((resp) => {
        setAllUsers(resp.data);
      })
      .finally(() => {
        setFetchingAllUsers(false);
      });
  };

  const handleTextInputChange = ({ target: { name, value } }) => {
    setTextInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { uid, username } = textInput;
    if (uid && username) {
      services.user.patch({ id: uid, username }).then(() => {
        fetchAllUsersAndSetState();
      });
    }
    setTextInput({ uid: "", username: "" });
  };

  useEffect(() => {
    fetchAllUsersAndSetState();
    services.auth.getCsrf();
  }, []);

  return (
    <div className="space-y-16">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 border-l-4 border-cyan-500 pl-4">Users</h2>
          <p className="text-slate-500 mt-2 ml-5">Directory of registered platform members</p>
        </div>
        <button 
          onClick={fetchAllUsersAndSetState}
          className="btn-ghost flex items-center space-x-2 text-cyan-600 hover:bg-cyan-50"
          disabled={fetchingAllUsers}
        >
          <svg className={`h-5 w-5 ${fetchingAllUsers ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-semibold">{fetchingAllUsers ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <div key={user.id} className="light-card p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-1">UID: {user.id}</div>
                  <div className="text-xl font-bold text-slate-800">{user.username}</div>
                </div>
              </div>
            </div>
          ))
        ) : !fetchingAllUsers && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-medium italic">Empty Directory</p>
          </div>
        )}
      </div>

      <div className="max-w-2xl">
        <div className="light-card p-10 bg-slate-50/50">
          <h3 className="text-2xl font-bold text-slate-900 mb-8">Update Records</h3>
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 italic">Target UID</label>
                <input
                  className="input-field shadow-sm"
                  type="text"
                  name="uid"
                  placeholder="ID"
                  value={textInput.uid}
                  onChange={handleTextInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1 italic">New Username</label>
                <input
                  className="input-field shadow-sm"
                  type="text"
                  name="username"
                  placeholder="New username"
                  value={textInput.username}
                  onChange={handleTextInputChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg"
            >
              Update Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Users;
