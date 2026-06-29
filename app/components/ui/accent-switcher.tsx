"use client";

import { useAccent } from "@/app/lib/use-accent";

export function AccentSwitcher() {
  const { accent, setAccent, accents } = useAccent();

  return (
    <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Accent color">
      {accents.map((a) => (
        <button
          key={a.id}
          onClick={() => setAccent(a.id)}
          className={`w-5 h-5 rounded-full transition-all duration-200 ${
            accent === a.id
              ? "ring-2 ring-offset-2 ring-offset-background scale-110"
              : "ring-1 ring-border/50 hover:scale-110"
          }`}
          style={{ backgroundColor: a.color }}
          aria-label={a.label}
          role="radio"
          aria-checked={accent === a.id}
          title={a.label}
        />
      ))}
    </div>
  );
}
