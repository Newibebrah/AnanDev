"use client";

import { useCallback, useSyncExternalStore } from "react";

const accents = [
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "purple", label: "Purple", color: "#a855f7" },
  { id: "green", label: "Green", color: "#22c55e" },
  { id: "amber", label: "Amber", color: "#f59e0b" },
  { id: "rose", label: "Rose", color: "#f43f5e" },
] as const;

type AccentId = (typeof accents)[number]["id"];

function getAccent(): AccentId {
  if (typeof window === "undefined") return "blue";
  return (localStorage.getItem("accent") as AccentId) || "blue";
}

function setAccentValue(id: AccentId) {
  document.documentElement.setAttribute("data-accent", id);
  localStorage.setItem("accent", id);
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-accent"] });
  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

export function useAccent() {
  const accent = useSyncExternalStore(subscribe, getAccent, () => "blue");
  const setAccent = useCallback((id: AccentId) => setAccentValue(id), []);
  return { accent, setAccent, accents };
}

export type { AccentId };
