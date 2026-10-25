import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { put } from "../../api";
import { useToast } from "../Toast";
import AdminFormFields from "./AdminFormFields";

export default function AdminSettings({ settings, onSaved }) {
  const notify = useToast();
  const [value, setValue] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => setValue(settings || {}), [settings]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await put("/admin/settings", value);
      notify("Website settings saved");
      onSaved();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
      <div className="mb-7 border-b border-slate-100 pb-5">
        <h2 className="text-xl font-semibold">Website details</h2>
        <p className="mt-1 text-sm text-slate-500">Keep contact information and homepage media up to date.</p>
      </div>
      <form onSubmit={save} className="space-y-6">
        <AdminFormFields
          includeSettings
          value={value}
          onChange={(name, next) => setValue((previous) => ({ ...previous, [name]: next }))}
        />
        <div className="border-t border-slate-100 pt-5">
          <button disabled={saving} className="admin-primary-button"><Save size={16} /> {saving ? "Saving…" : "Save settings"}</button>
        </div>
      </form>
    </section>
  );
}
