import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { del, post, put } from "../../api";
import { useToast } from "../Toast";
import AdminFormFields, { fieldDefinitions } from "./AdminFormFields";

const blank = (section) =>
  Object.fromEntries(
    (fieldDefinitions[section] || []).map((key) => [key, ""])
  );

export default function AdminResourcePage({
  section,
  records,
  loading,
  onChanged,
}) {
  const notify = useToast();
  const entries = Array.isArray(records) ? records : [];

  const [current, setCurrent] = useState(blank(section));
  const [saving, setSaving] = useState(false);

  const title = (record) =>
    record.title || record.author || record.name || "Untitled record";

  async function save(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const content = Object.fromEntries(
        Object.keys(blank(section)).map((key) => [
          key,
          current[key] ?? "",
        ])
      );

      if (current.id) {
        await put("/admin/" + section + "/" + current.id, content);
      } else {
        await post("/admin/" + section, content);
      }

      notify(current.id ? "Changes saved" : "Entry created");
      setCurrent(blank(section));
      onChanged();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this record?")) return;

    try {
      await del("/admin/" + section + "/" + id);

      if (current.id === id) {
        setCurrent(blank(section));
      }

      notify("Record deleted");
      onChanged();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">

      {/* Scrollable sidebar */}
      <aside className="rounded-2xl border border-slate-200 bg-white xl:sticky xl:top-6">
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Content entries</h2>
              <p className="mt-1 text-xs text-slate-500">
                {entries.length} total
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[65vh] space-y-2 overflow-y-auto overscroll-contain p-3">
          {entries.map((record) => (
            <div
              key={record.id}
              className={
                "flex items-center gap-2 rounded-xl border p-3 transition " +
                (current.id === record.id
                  ? "border-[#9a6854]/40 bg-[#faf7f5]"
                  : "border-slate-100 hover:border-slate-300")
              }
            >
              <button
                type="button"
                onClick={() => setCurrent(record)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="block truncate text-sm font-semibold">
                  {title(record)}
                </span>

                <span className="mt-1 block truncate text-xs text-slate-500">
                  {record.slug ||
                    record.status ||
                    record.video_url ||
                    "Content entry"}
                </span>
              </button>

              <button
                type="button"
                aria-label={"Delete " + title(record)}
                onClick={() => remove(record.id)}
                className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {!entries.length && (
            <EmptyState loading={loading} label="entries" />
          )}
        </div>
      </aside>

      {/* Main form */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#a66d59]">
            {section}
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {current.id ? "Edit entry" : "Create an entry"}
          </h2>
        </div>

        <form onSubmit={save} className="space-y-6">
          <AdminFormFields
            section={section}
            value={current}
            onChange={(name, value) =>
              setCurrent((previous) => ({
                ...previous,
                [name]: value,
              }))
            }
          />

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
            <button disabled={saving} className="admin-primary-button">
              {saving
                ? "Saving…"
                : current.id
                  ? "Save changes"
                  : "Create entry"}
            </button>

            {current.id && (
              <button
                type="button"
                onClick={() => remove(current.id)}
                className="admin-danger-button"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

function EmptyState({ loading, label }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
      {loading ? "Loading…" : `No ${label} to show yet.`}
    </p>
  );
}