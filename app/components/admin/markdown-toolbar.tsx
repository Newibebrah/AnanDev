"use client";

import { Button } from "@/app/components/ui/button";

interface MarkdownToolbarProps {
  textareaId: string;
}

export function MarkdownToolbar({ textareaId }: MarkdownToolbarProps) {
  function insertAtCursor(before: string, after: string, defaultText: string) {
    const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end) || defaultText;
    const insertion = `${before}${selected}${after}`;
    el.value = el.value.substring(0, start) + insertion + el.value.substring(end);
    el.selectionStart = el.selectionEnd = start + insertion.length;
    el.focus();
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function promptImage() {
    const url = prompt("Image URL:");
    if (!url) return;
    const alt = prompt("Alt text (description):") || "image";
    insertAtCursor(`![${alt}](`, ")", url);
  }

  function promptLink() {
    const url = prompt("Link URL:");
    if (!url) return;
    const text = prompt("Link text:") || url;
    insertAtCursor("[", `](${url})`, text);
  }

  function promptBold() {
    insertAtCursor("**", "**", "bold text");
  }

  function promptItalic() {
    insertAtCursor("*", "*", "italic text");
  }

  function promptCode() {
    insertAtCursor("`", "`", "code");
  }

  function promptHeading() {
    insertAtCursor("### ", "", "Heading");
  }

  function promptList() {
    insertAtCursor("\n- ", "", "item");
  }

  return (
    <div className="flex flex-wrap items-center gap-1 mb-2 border border-input rounded-md p-1.5 bg-muted/30" role="toolbar" aria-label="Markdown formatting">
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={promptHeading} aria-label="Insert heading">
        H
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs font-bold" onClick={promptBold} aria-label="Insert bold text">
        B
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs italic" onClick={promptItalic} aria-label="Insert italic text">
        I
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs font-mono" onClick={promptCode} aria-label="Insert code">
        {"<>"}
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={promptList} aria-label="Insert list item">
        List
      </Button>
      <span className="w-px h-5 bg-border mx-1" aria-hidden="true" />
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={promptLink} aria-label="Insert link">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Link
      </Button>
      <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={promptImage} aria-label="Insert image">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        Image
      </Button>
    </div>
  );
}
