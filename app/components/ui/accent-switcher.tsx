"use client";

import { useState, useRef, useEffect } from "react";
import { useAccent } from "@/app/lib/use-accent";

export function AccentSwitcher() {
  const { accent, setAccent, accents } = useAccent();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = accents.find((a) => a.id === accent) || accents[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-8 px-2 rounded-md border border-border/60 bg-background/50 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 text-xs text-muted-foreground hover:text-foreground"
        aria-label="Select accent color"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 ring-1 ring-border/30"
          style={{ backgroundColor: current.color }}
        />
        <span className="hidden sm:inline font-medium">{current.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-40 rounded-lg border border-border/60 bg-card shadow-xl backdrop-blur-xl p-1.5 z-50 animate-scale-in"
          role="listbox"
          aria-label="Accent colors"
        >
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setAccent(a.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-all duration-200 ${
                accent === a.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
              role="option"
              aria-selected={accent === a.id}
            >
              <span
                className="w-4 h-4 rounded-full shrink-0 ring-1 ring-border/20"
                style={{ backgroundColor: a.color }}
              />
              <span className="flex-1 text-left">{a.label}</span>
              {accent === a.id && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
