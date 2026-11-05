import React, { useEffect, useRef } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo2,
  RemoveFormatting,
  Underline,
  Undo2,
} from "lucide-react";
import { sanitizeRichHtml } from "../../utils/richText";

const toolbarGroups = [
  [
    { label: "Paragraph", command: "formatBlock", value: "p", icon: "¶" },
    { label: "Heading 2", command: "formatBlock", value: "h2", Icon: Heading2 },
    { label: "Heading 3", command: "formatBlock", value: "h3", Icon: Heading3 },
  ],
  [
    { label: "Bold", command: "bold", Icon: Bold },
    { label: "Italic", command: "italic", Icon: Italic },
    { label: "Underline", command: "underline", Icon: Underline },
  ],
  [
    { label: "Bulleted list", command: "insertUnorderedList", Icon: List },
    { label: "Numbered list", command: "insertOrderedList", Icon: ListOrdered },
  ],
  [
    { label: "Align left", command: "justifyLeft", Icon: AlignLeft },
    { label: "Center paragraph", command: "justifyCenter", Icon: AlignCenter },
    { label: "Align right", command: "justifyRight", Icon: AlignRight },
    { label: "Justify paragraph", command: "justifyFull", Icon: AlignJustify },
  ],
  [
    { label: "Undo", command: "undo", Icon: Undo2 },
    { label: "Redo", command: "redo", Icon: Redo2 },
    {
      label: "Clear formatting",
      command: "removeFormat",
      Icon: RemoveFormatting,
    },
  ],
];

export default function AdminRichTextEditor({ label, value = "", onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || editor === document.activeElement) return;
    const safeValue = sanitizeRichHtml(value);
    if (editor.innerHTML !== safeValue) editor.innerHTML = safeValue;
  }, [value]);

  function updateValue() {
    if (editorRef.current) {
      onChange(sanitizeRichHtml(editorRef.current.innerHTML));
    }
  }

  function runCommand(command, valueToApply) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (command === "formatBlock") {
      document.execCommand(command, false, valueToApply.toUpperCase());
    } else {
      document.execCommand(command, false, valueToApply);
    }
    updateValue();
  }

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-[#a66d59] focus-within:ring-2 focus-within:ring-[#a66d59]/10">
      <div
        role="toolbar"
        aria-label={`${label} formatting`}
        className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2"
      >
        {toolbarGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex flex-wrap items-center gap-1 border-r border-slate-200 pr-2 last:border-0 last:pr-0"
          >
            {group.map(({ label: actionLabel, command, value: commandValue, Icon, icon }) => (
              <button
                key={actionLabel}
                type="button"
                title={actionLabel}
                aria-label={actionLabel}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runCommand(command, commandValue)}
                className="grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-slate-600 transition hover:bg-white hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a66d59]"
              >
                {Icon ? <Icon size={16} aria-hidden="true" /> : <span>{icon}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        onInput={updateValue}
        className="admin-rich-editor min-h-40 px-4 py-3 text-sm leading-7 text-slate-800 outline-none"
      />
      <p className="border-t border-slate-100 px-4 py-2 text-xs font-normal text-slate-500">
        Use the toolbar to format your text. Press Enter to start a new paragraph.
      </p>
    </div>
  );
}
