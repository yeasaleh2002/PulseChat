"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/chat/sidebar";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Menu, MessageSquare, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggleMobileSidebar } = useChatStore();
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar (Left Pane) */}
      <Sidebar />

      {/* Main Chat Area (Right Pane) */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Mobile Navbar Header */}
        <header className="md:hidden flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMobileSidebar}
              aria-label="Open mobile sidebar menu"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" title="Go to Home Landing Page" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                PulseChat
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              title="Go to Home Landing Page"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
