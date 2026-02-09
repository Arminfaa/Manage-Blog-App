"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ImagePreviewer({ src, alt, className = "", children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`absolute inset-0 w-full h-full text-start cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-lg overflow-hidden ${className}`}
        aria-label="باز کردن تصویر در سایز اصلی"
      >
        {children}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="پیش‌نمایش تصویر"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="بستن"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-[95vw] max-h-[95vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
