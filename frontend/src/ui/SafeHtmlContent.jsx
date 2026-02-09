"use client";

import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code", "a", "span", "div",
];
const ALLOWED_ATTR = ["href", "target", "rel", "class", "style", "dir"];

export default function SafeHtmlContent({ html, className = "" }) {
  const [sanitized, setSanitized] = useState("");

  useEffect(() => {
    if (!html) {
      setSanitized("");
      return;
    }
    setSanitized(
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ADD_ATTR: ["target"],
      })
    );
  }, [html]);

  if (!html) return null;
  if (!sanitized) return null;

  return (
    <div
      className={`prose-content ${className}`}
      dir="rtl"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
