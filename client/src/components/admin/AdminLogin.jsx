import React from "react";
import { LockKeyhole } from "lucide-react";

export default function AdminLogin({ login, setLogin, onSubmit }) {
  return (
    <main className="admin-app flex min-h-screen items-center justify-center bg-[#f5f6f8] px-5 py-12 text-slate-900">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10"
      >
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182b2a] text-white">
          <LockKeyhole size={21} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a66d59]">HEIGHT / ADMIN</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage your website content.</p>
        <label className="mt-8 block text-sm font-medium text-slate-700">
          Username
          <input
            className="admin-field mt-2"
            required
            autoComplete="username"
            value={login.username}
            onChange={(event) => setLogin({ ...login, username: event.target.value })}
          />
        </label>
        <label className="mt-5 block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            className="admin-field mt-2"
            required
            autoComplete="current-password"
            value={login.password}
            onChange={(event) => setLogin({ ...login, password: event.target.value })}
          />
        </label>
        <button className="admin-primary-button mt-7 w-full justify-center">Sign in</button>
      </form>
    </main>
  );
}
