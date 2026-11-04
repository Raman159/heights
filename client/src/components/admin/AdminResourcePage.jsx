import React, { useEffect, useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { del, get, post, put } from "../../api";
import { useToast } from "../Toast";
import AdminConfirmDialog from "./AdminConfirmDialog";
import AdminFormFields, { fieldDefinitions } from "./AdminFormFields";

const blank = (section) =>
  Object.fromEntries(
    (fieldDefinitions[section] || []).map((key) => [
      key,
      key === "category" ? "Spaces" : "",
    ])
  );

export default function AdminResourcePage({
  section,
  records,
  loading,
  onChanged,
}) {
  const notify = useToast();
  const entries = Array.isArray(records) ? records : [];
  const [categories, setCategories] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [current, setCurrent] = useState(blank(section));
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  useEffect(() => {
    if (section !== "spa_treatments") return;
    get("/admin/spa_categories")
      .then(setCategories)
      .catch((error) => notify(error.message, "error"));
  }, [section, notify]);

  const title = (record) =>
    record.title || record.full_name || record.author || record.name || "Untitled record";

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

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await del("/admin/" + section + "/" + pendingDelete.id);

      if (current.id === pendingDelete.id) {
        setCurrent(blank(section));
      }

      notify("Record deleted");
      setPendingDelete(null);
      onChanged();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setDeleting(false);
    }
  }

  async function move(record, target, position) {
    if (!record || !target || record.id === target.id) return;
    setReordering(true);
    try {
      await put("/admin/" + section + "/" + record.id + "/order", {
        targetId: target.id,
        position,
      });
      onChanged();
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setReordering(false);
      setDraggedId(null);
      setDropTargetId(null);
    }
  }

  return (
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">

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
                draggable={!reordering}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(record.id));
                  setDraggedId(record.id);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setDropTargetId(record.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const sourceId = Number(event.dataTransfer.getData("text/plain"));
                  const source = entries.find((entry) => entry.id === sourceId);
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const position =
                    event.clientY < bounds.top + bounds.height / 2
                      ? "before"
                      : "after";
                  setDropTargetId(null);
                  move(source, record, position);
                }}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDropTargetId(null);
                }}
                className={
                  "flex items-center gap-2 rounded-xl border p-3 transition " +
                  (draggedId === record.id ? "cursor-grabbing opacity-40 " : "cursor-grab ") +
                  (dropTargetId === record.id && draggedId !== record.id
                    ? "border-[#9a6854] bg-[#faf7f5] "
                    : "") +
                  (current.id === record.id
                    ? "border-[#9a6854]/40 bg-[#faf7f5]"
                    : "border-slate-100 hover:border-slate-300")
              }
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 text-slate-400"
                  title="Drag to reorder"
                >
                  <GripVertical size={17} />
                </span>
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
                    record.file_url ||
                    record.designation ||
                    "Content entry"}
                </span>
              </button>

              <button
                type="button"
                aria-label={"Delete " + title(record)}
                onClick={() => setPendingDelete(record)}
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
      <section className="min-w-0 max-w-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-7">
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
            categories={categories}
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
                onClick={() => setPendingDelete(current)}
                className="admin-danger-button"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </form>
      </section>
      <AdminConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete content entry?"
        message={`“${pendingDelete ? title(pendingDelete) : ""}” will be permanently deleted.`}
        busy={deleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
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