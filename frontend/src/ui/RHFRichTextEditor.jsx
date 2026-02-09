"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useEffect, useState } from "react";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Button from "@/ui/Button";
import SafeHtmlContent from "@/ui/SafeHtmlContent";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TOOLBAR_TITLES = {
  "ql-bold": "بولد",
  "ql-italic": "ایتالیک",
  "ql-underline": "زیرخط",
  "ql-strike": "خط‌خورده",
  "ql-list": "لیست",
  "ql-blockquote": "نقل‌قول",
  "ql-code-block": "بلوک کد",
  "ql-link": "لینک",
  "ql-clean": "پاک کردن فرمت",
  "ql-header": "عنوان",
  "ql-size": "سایز فونت",
  "ql-color": "رنگ متن",
  "ql-background": "رنگ پس‌زمینه",
};

const HEADER_LABELS = ["عنوان ۱", "عنوان ۲", "عنوان ۳", "عنوان ۴", "عنوان ۵", "عنوان ۶", "معمولی"];
const SIZE_LABELS = ["کوچک", "معمولی", "بزرگ", "خیلی بزرگ"];

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "blockquote",
  "code-block",
  "link",
];

function localizeToolbarFa(container) {
  if (!container) return;
  const toolbar = container.querySelector(".ql-toolbar");
  if (!toolbar) return;

  toolbar.setAttribute("dir", "rtl");

  toolbar.querySelectorAll("button, .ql-picker").forEach((el) => {
    for (const [cls, title] of Object.entries(TOOLBAR_TITLES)) {
      if (el.classList.contains(cls)) {
        el.setAttribute("title", title);
        break;
      }
    }
  });

  const headerSelect = toolbar.querySelector("select.ql-header");
  if (headerSelect) {
    Array.from(headerSelect.options).forEach((opt, i) => {
      if (HEADER_LABELS[i]) opt.textContent = HEADER_LABELS[i];
    });
  }

  const sizeSelect = toolbar.querySelector("select.ql-size");
  if (sizeSelect) {
    Array.from(sizeSelect.options).forEach((opt, i) => {
      if (SIZE_LABELS[i]) opt.textContent = SIZE_LABELS[i];
    });
  }
}

function useIsMd() {
  const [isMd, setIsMd] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsMd(mq.matches);
    const handler = () => setIsMd(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMd;
}

export default function RHFRichTextEditor({
  value,
  onChange,
  label,
  name,
  isRequired = false,
  errors,
  placeholder = "متن پست را اینجا بنویسید...",
  minHeight = "280px",
}) {
  const wrapperRef = useRef(null);
  const modalWrapperRef = useRef(null);
  const quillModules = useMemo(() => modules, []);
  const quillFormats = useMemo(() => formats, []);
  const isMd = useIsMd();

  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [draftValue, setDraftValue] = useState("");

  useEffect(() => {
    const t = setTimeout(() => localizeToolbarFa(wrapperRef.current), 100);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    if (fullScreenOpen && modalWrapperRef.current) {
      const t = setTimeout(() => localizeToolbarFa(modalWrapperRef.current), 150);
      return () => clearTimeout(t);
    }
  }, [fullScreenOpen, draftValue]);

  const openFullScreen = () => {
    setDraftValue(value || "");
    setFullScreenOpen(true);
  };

  const closeFullScreenConfirm = () => {
    onChange(draftValue);
    setFullScreenOpen(false);
  };

  const closeFullScreenCancel = () => {
    setFullScreenOpen(false);
  };

  const errorMessages = errors?.[name];
  const hasError = !!(errors && errorMessages);

  const editorWrapperClass =
    "rich-editor-wrapper rounded-lg overflow-hidden border border-secondary-200 bg-secondary-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:bg-secondary-100 [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-right [&_.ql-editor]:text-secondary-900 [&_.ql-editor.ql-blank::before]:text-secondary-400 [&_.ql-editor.ql-blank::before]:font-normal [&_.ql-editor]:font-sans";

  if (!isMd) {
    return (
      <div className={`textField relative ${hasError ? "textField--invalid" : ""}`}>
        <label htmlFor={name} className="mb-2 block text-secondary-700">
          {label}
          {isRequired && <span className="text-error">*</span>}
        </label>
        {value && value.replace(/<[^>]*>/g, "").trim() ? (
          <div className="rounded-lg border border-secondary-200 bg-secondary-0 overflow-hidden">
            <div className="p-4 min-h-[120px] text-right max-h-[320px] overflow-y-auto overflow-x-hidden min-w-0 break-words" dir="rtl">
              <SafeHtmlContent html={value} className="text-secondary-700 leading-7 text-sm break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:max-w-full" />
            </div>
            <div className="p-3 border-t border-secondary-200 bg-secondary-50">
              <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={openFullScreen}>
                <PencilSquareIcon className="w-5 h-5" />
                ویرایش
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFullScreen}
            className="w-full min-h-[120px] rounded-lg border-2 border-dashed border-secondary-300 bg-secondary-50 text-right p-4 text-secondary-600 hover:border-primary-400 hover:bg-primary-50/30 transition-colors"
            dir="rtl"
          >
            <span className="text-secondary-400">{placeholder}</span>
          </button>
        )}

        {fullScreenOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-secondary-0 md:hidden">
            {/* <header className="flex-shrink-0 h-12 flex items-center justify-end p-2 border-b border-secondary-200 bg-secondary-100">
              <button
                type="button"
                onClick={closeFullScreenCancel}
                className="p-2 rounded-lg hover:bg-secondary-200 text-secondary-700"
                aria-label="بستن"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </header> */}
            <div className="flex-1 min-h-0 overflow-auto rich-editor-fullscreen">
              <div ref={modalWrapperRef} className={editorWrapperClass + " border-0 rounded-none min-h-full"} dir="rtl">
                <ReactQuill
                  theme="snow"
                  value={draftValue}
                  onChange={setDraftValue}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder={placeholder}
                  className="[&_.ql-editor]:min-h-[280px] rich-editor-fa"
                />
              </div>
            </div>
            <footer className="flex-shrink-0 flex gap-3 p-4 border-t border-secondary-200 bg-secondary-50">
              <Button type="button" variant="outline" className="flex-1" onClick={closeFullScreenCancel}>
                انصراف
              </Button>
              <Button type="button" variant="primary" className="flex-1" onClick={closeFullScreenConfirm}>
                تایید
              </Button>
            </footer>
          </div>
        )}

        {errors && errors[name] && (
          <span className="text-red-600 block text-xs mt-2">{errors[name]?.message}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`textField relative ${hasError ? "textField--invalid" : ""}`}>
      <label htmlFor={name} className="mb-2 block text-secondary-700">
        {label}
        {isRequired && <span className="text-error">*</span>}
      </label>
      <div ref={wrapperRef} className={editorWrapperClass} dir="rtl">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={onChange}
          modules={quillModules}
          formats={quillFormats}
          placeholder={placeholder}
          style={{ minHeight }}
          className="[&_.ql-editor]:min-h-[200px] rich-editor-fa"
        />
      </div>
      {errors && errors[name] && (
        <span className="text-red-600 block text-xs mt-2">{errors[name]?.message}</span>
      )}
    </div>
  );
}
