"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
    error: "bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200",
    info: "bg-blue-50 dark:bg-blue-950/80 border-blue-300 dark:border-blue-800 text-blue-800 dark:text-blue-200",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-[110] flex items-center gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 max-w-sm animate-fade-in",
        typeStyles[type]
      )}
      role="alert"
    >
      {icons[type]}
      <p className="text-xs font-medium flex-1 leading-snug">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Close notification"
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
}
