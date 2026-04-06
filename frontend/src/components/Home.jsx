function Home({ user }) {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">
        {user ? `Welcome back, ${user.username}` : "Personal Dashboard"}
      </h1>
      <p className="mt-4 text-slate-500 text-lg">
        {user 
          ? "Manage your information and platform data in one place."
          : "Please sign in to access your dashboard and manage your data."}
      </p>
      
      <div className="mt-16 p-12 light-card max-w-2xl mx-auto">
        <p className="text-slate-600 leading-relaxed">
          {user 
            ? "Welcome to your workspace. Use the navigation to explore users or manage your session."
            : "Explore the platform or join us today to get started with your own profile."}
        </p>
      </div>
    </div>
  );
}

export default Home;
