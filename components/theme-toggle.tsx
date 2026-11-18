"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Switches between the night palette (default) and a warm paper light mode, and remembers it. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("alte-theme", next);
    } catch {}
    setTheme(next);
  };

  const light = theme === "light";
  return (
    <button
      type="button"
      onClick={flip}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={light}
      className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full text-bone-2 transition-colors duration-300 hover:bg-bone/10 hover:text-bone ${className}`}
    >
      <Sun
        aria-hidden
        className={`absolute size-[18px] transition-[transform,opacity] duration-500 ease-out-expo ${light ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
        strokeWidth={1.75}
      />
      <Moon
        aria-hidden
        className={`absolute size-[18px] transition-[transform,opacity] duration-500 ease-out-expo ${light ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
        strokeWidth={1.75}
      />
    </button>
  );
}
