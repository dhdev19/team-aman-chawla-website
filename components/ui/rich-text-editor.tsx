"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "color",
    "background",
  ];

  return (
    <div className={className}>
      <div className={`border rounded-md ${error ? "border-red-500" : "border-neutral-300"}`}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="bg-white"
          style={{ minHeight: "300px" }}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
