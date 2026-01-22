"use client";

import * as React from "react";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  error,
  className = "",
}: RichTextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleFormat = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value || textarea.value.substring(start, end);
    let formattedText = "";

    switch (command) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${selectedText}</em>`;
        break;
      case "h2":
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case "h3":
        formattedText = `<h3>${selectedText}</h3>`;
        break;
      case "ul":
        formattedText = `<ul><li>${selectedText}</li></ul>`;
        break;
      case "ol":
        formattedText = `<ol><li>${selectedText}</li></ol>`;
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) {
          formattedText = `<a href="${url}">${selectedText}</a>`;
        } else {
          return;
        }
        break;
      default:
        formattedText = selectedText;
    }

    const newValue =
      textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="border border-b-0 rounded-t-md bg-neutral-50 p-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleFormat("h2")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleFormat("h3")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200"
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => handleFormat("bold")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200 font-bold"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat("italic")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200 italic"
          title="Italic"
        >
          <em>I</em>
        </button>
        <div className="w-px bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => handleFormat("ul")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => handleFormat("ol")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200"
          title="Numbered List"
        >
          1.
        </button>
        <div className="w-px bg-neutral-300 mx-1" />
        <button
          type="button"
          onClick={() => handleFormat("link")}
          className="px-3 py-1 text-sm border border-neutral-300 rounded hover:bg-neutral-200"
          title="Insert Link"
        >
          🔗
        </button>
      </div>

      {/* Textarea */}
      <div className={`border rounded-b-md ${error ? "border-red-500" : "border-neutral-300"}`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[300px] p-4 border-0 focus:outline-none focus:ring-0 resize-y font-mono text-sm"
          style={{ fontFamily: "monospace" }}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-neutral-500">
        💡 <strong>Tip:</strong> Select text and click toolbar buttons to format. You can also type HTML directly (e.g., &lt;h2&gt;Heading&lt;/h2&gt;, &lt;strong&gt;bold&lt;/strong&gt;, &lt;em&gt;italic&lt;/em&gt;).
      </p>
    </div>
  );
}
