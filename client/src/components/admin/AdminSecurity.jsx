import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { post } from "../../api";
import { useToast } from "../Toast";

export default function AdminSecurity() {
  const notify = useToast();
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "" });
  const [saving, setSaving] = useState(false);

  async function changePassword(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await post("/auth/change-password", passwords);
      setPasswords({ old_password: "", new_password: "" });
      notify("Password updated");
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
      <div className="mb-7 flex items-start gap-4 border-b border-slate-100 pb-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f1ed] text-[#9a6854]"><KeyRound size={20} /></span>
        <div>
          <h2 className="text-xl font-semibold">Change password</h2>
          <p className="mt-1 text-sm text-slate-500">Use a strong password with at least 12 characters.</p>
        </div>
      </div>
      <form onSubmit={changePassword} className="space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Current password
          <input type="password" required autoComplete="current-password" className="admin-field mt-2" value={passwords.old_password} onChange={(event) => setPasswords({ ...passwords, old_password: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          New password
          <input type="password" required minLength={12} autoComplete="new-password" className="admin-field mt-2" value={passwords.new_password} onChange={(event) => setPasswords({ ...passwords, new_password: event.target.value })} />
        </label>
        <button disabled={saving} className="admin-primary-button">{saving ? "Updating…" : "Update password"}</button>
      </form>
    </section>
  );
}
