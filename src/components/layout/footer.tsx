"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Shield, Lock, Cpu } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/chat" || pathname?.startsWith("/chat/") || pathname === "/login") {
    return null;
  }
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {APP_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              {APP_CONFIG.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> AES-256 Encrypted
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-500" /> Next.js App Router
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-500" /> WebSocket Ready
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/#features" className="hover:text-brand-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#security" className="hover:text-brand-500 transition-colors">
                  Security Headers
                </Link>
              </li>
              <li>
                <Link href="/#architecture" className="hover:text-brand-500 transition-colors">
                  ISR & SEO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="hover:text-brand-500 transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-brand-500 transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-brand-500 transition-colors cursor-pointer">
                  Security Overview
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.</p>
          <p>Built with Next.js 15, Tailwind CSS & next-themes</p>
        </div>
      </div>
    </footer>
  );
}
