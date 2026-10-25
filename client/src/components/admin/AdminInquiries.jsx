import React from "react";
import { Check, Trash2 } from "lucide-react";
import { del, put } from "../../api";
import { useToast } from "../Toast";

export default function AdminInquiries({ records, loading, onChanged }) {
  const notify = useToast();
  const entries = Array.isArray(records) ? records : [];

  async function markHandled(record) {
    try {
      await put("/admin/inquiries/" + record.id, { status: record.status === "handled" ? "new" : "handled" });
      notify(record.status === "handled" ? "Inquiry reopened" : "Inquiry marked as handled");
      onChanged();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await del("/admin/inquiries/" + id);
      notify("Inquiry deleted");
      onChanged();
    } catch (error) {
      notify(error.message, "error");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-slate-500">Messages and booking requests sent through your website.</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{entries.length} inquiries</h2>
      </div>
      {entries.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {entries.map((record) => (
            <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{record.name} <span className="font-normal text-slate-500">· {record.type}</span></h3>
                  <p className="mt-1 text-xs text-slate-500">{new Date(record.created_at).toLocaleString()}</p>
                </div>
                <span className={"rounded-full px-2.5 py-1 text-xs font-medium " + (record.status === "handled" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-800")}>{record.status === "handled" ? "Handled" : "New"}</span>
              </div>
              <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="text-slate-400">Email </span>{record.email}</p>
                <p><span className="text-slate-400">Phone </span>{record.phone}</p>
                {record.service && <p><span className="text-slate-400">Service </span>{record.service}</p>}
                {record.preferred_date && <p><span className="text-slate-400">Preferred date </span>{record.preferred_date}</p>}
              </div>
              {record.message && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{record.message}</p>}
              <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                <button onClick={() => markHandled(record)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#95614e] hover:text-[#182b2a]"><Check size={16} /> {record.status === "handled" ? "Reopen" : "Mark handled"}</button>
                <button onClick={() => remove(record.id)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-700"><Trash2 size={15} /> Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">{loading ? "Loading…" : "No inquiries to show yet."}</p>
      )}
    </div>
  );
}
