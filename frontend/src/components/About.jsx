import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import services from "../services";

function About({ user }) {
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    services.auth
      .getAbout()
      .then((resp) => {
        setBio(resp.data.bio || "");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleEdit = () => {
    setDraft(bio);
    setEditing(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await services.auth.saveAbout(draft);
      setBio(draft);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft("");
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight mb-4">About</h1>
        <p className="text-slate-500">
          <Link to="/login" className="text-cyan-600 hover:underline font-medium">Sign in</Link> to view and edit your personal About page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">About</h1>
          <p className="text-slate-400 text-sm mt-1">{user.username}</p>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      <div className="light-card p-8 min-h-[200px]">
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
          </div>
        ) : editing ? (
          <div className="space-y-4">
            <textarea
              className="w-full min-h-[180px] px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 resize-none transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 leading-relaxed"
              placeholder="Write something about yourself..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : bio ? (
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{bio}</p>
        ) : (
          <p className="text-slate-400 italic">Nothing here yet. Click Edit to add something about yourself.</p>
        )}
      </div>

      {saved && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium animate-fade-in">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Saved successfully
        </div>
      )}
    </div>
  );
}

export default About;
