"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Laptop, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" />
    );
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  const currentIcon =
    activeTheme === "dark" ? (
      <Moon className="w-4 h-4 text-indigo-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-500" />
    );

  const toggleQuickTheme = () => {
    const nextTheme = activeTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const options = [
    { label: "Light", value: "light", icon: Sun },
    { label: "Dark", value: "dark", icon: Moon },
    { label: "System", value: "system", icon: Laptop },
  ];

  return (
    <div ref={containerRef} className="relative inline-flex items-center text-left">
      <button
        onClick={toggleQuickTheme}
        type="button"
        aria-label="Toggle color theme"
        title={`Current: ${theme} mode (Click to toggle)`}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full",
          "bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800",
          "text-slate-700 dark:text-slate-200 shadow-sm",
          "hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
          "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        )}
      >
        {currentIcon}
      </button>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-label="Open theme options menu"
        aria-expanded={isOpen}
        className="p-1 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1 backdrop-blur-md animate-fade-in">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                  isSelected
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
