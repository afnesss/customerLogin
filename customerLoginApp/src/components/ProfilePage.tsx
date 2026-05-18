const ProfilePage = () => {
  const savedUser = localStorage.getItem("auth_user");

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/90 p-7 text-center shadow-[0_28px_90px_rgba(15,23,42,0.16)] backdrop-blur md:p-9">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-700">
          Profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          You are signed in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          User session found.
        </p>
        {savedUser ? (
          <pre className="mt-6 overflow-auto rounded-2xl bg-slate-950 p-4 text-left text-xs text-slate-100">
            {savedUser}
          </pre>
        ) : null}
      </section>
    </main>
  );
};

export default ProfilePage;
