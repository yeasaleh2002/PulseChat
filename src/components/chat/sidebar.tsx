"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { UserSearch } from "./user-search";
import { ConversationSkeleton } from "./conversation-skeleton";
import { CreateGroupModal } from "./create-group-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { formatConversationTimestamp, cn } from "@/lib/utils";
import { Conversation, User } from "@/types";
import Link from "next/link";
import {
  MessageSquare,
  Users,
  User as UserIcon,
  LogOut,
  X,
  Plus,
  MessageCircle,
  Home,
} from "lucide-react";

export function Sidebar() {
  const { user, logoutAction } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    isLoadingConversations,
    fetchConversations,
    setActiveConversationId,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    unreadCounts,
  } = useChatStore();

  const [filterTab, setFilterTab] = useState<"all" | "direct" | "group">("all");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  const filteredConversations = safeConversations.filter((c) => {
    if (filterTab === "direct") return c.type === "direct";
    if (filterTab === "group") return c.type === "group";
    return true;
  });

  const getConversationTitle = (c: Conversation): string => {
    if (c.type === "group") {
      return c.name || "Group Chat";
    }
    if (c.participant && typeof c.participant === "object" && (c.participant as User).name) {
      return (c.participant as User).name;
    }
    if (Array.isArray(c.participants)) {
      const otherUser = c.participants.find(
        (p) => typeof p !== "string" && (p as User)._id !== user?._id
      ) as User | undefined;
      if (otherUser?.name) return otherUser.name;
    }
    if (c.name && c.name !== "Direct Chat") return c.name;
    return "Direct Chat";
  };

  const getConversationAvatarText = (c: Conversation): string => {
    const title = getConversationTitle(c);
    return title.slice(0, 2).toUpperCase();
  };

  const getLastMessageText = (c: Conversation): string => {
    if (!c.lastMessage) return "No messages yet";
    if (typeof c.lastMessage === "object" && "text" in c.lastMessage) {
      return (c.lastMessage as { text: string }).text;
    }
    return "Message received";
  };

  return (
    <>
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 md:w-80 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 shrink-0",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link href="/" title="Go to Home Landing Page" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              PulseChat
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              title="New Group"
              className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/80 transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Plus className="w-4 h-4" /> Group
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-3 border-b border-slate-100 dark:border-slate-800/60">
          <UserSearch />
        </div>

        <div className="flex items-center gap-1 p-2 mx-3 mt-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setFilterTab("all")}
            className={cn(
              "flex-1 py-1.5 rounded-lg transition-colors text-center",
              filterTab === "all"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterTab("direct")}
            className={cn(
              "flex-1 py-1.5 rounded-lg transition-colors text-center flex items-center justify-center gap-1",
              filterTab === "direct"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <UserIcon className="w-3 h-3" /> Direct
          </button>
          <button
            onClick={() => setFilterTab("group")}
            className={cn(
              "flex-1 py-1.5 rounded-lg transition-colors text-center flex items-center justify-center gap-1",
              filterTab === "group"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Users className="w-3 h-3" /> Groups
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingConversations ? (
            <ConversationSkeleton />
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No conversations found. Search users or click &quot;Group&quot; to start chatting!
              </p>
            </div>
          ) : (
            filteredConversations.map((item) => {
              const isActive = activeConversationId === item._id;
              const unreadCount = unreadCounts[item._id] || 0;
              const hasUnread = unreadCount > 0 && !isActive;

              const title = getConversationTitle(item);
              const avatarText = getConversationAvatarText(item);
              const lastMsg = getLastMessageText(item);
              const timestamp = formatConversationTimestamp(item.updatedAt || item.createdAt);

              return (
                <button
                  key={item._id}
                  onClick={() => setActiveConversationId(item._id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 text-left border relative",
                    isActive
                      ? "bg-brand-50/90 dark:bg-brand-950/80 border-brand-200 dark:border-brand-800 shadow-sm"
                      : hasUnread
                      ? "bg-brand-50/70 dark:bg-brand-950/40 border-brand-300 dark:border-brand-700/60 shadow-sm"
                      : "border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-900/70"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-sm relative",
                      item.type === "group"
                        ? "bg-gradient-to-tr from-purple-500 to-indigo-600"
                        : "bg-gradient-to-tr from-brand-500 to-blue-600"
                    )}
                  >
                    {item.type === "group" ? <Users className="w-4 h-4" /> : avatarText}
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-white dark:border-slate-950 animate-ping" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          "text-xs font-semibold truncate",
                          isActive
                            ? "text-brand-700 dark:text-brand-300"
                            : hasUnread
                            ? "text-brand-600 dark:text-brand-400 font-bold"
                            : "text-slate-900 dark:text-slate-100"
                        )}
                      >
                        {title}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {hasUnread && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-full bg-brand-600 text-white shadow-sm shadow-brand-500/40">
                            {unreadCount}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {timestamp}
                        </span>
                      </div>
                    </div>

                    <p
                      className={cn(
                        "text-[11px] truncate leading-snug",
                        hasUnread
                          ? "text-slate-900 dark:text-slate-100 font-medium"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {lastMsg}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {user?.name || "Anonymous"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href="/"
              title="Go to Home Landing Page"
              className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <button
              onClick={() => logoutAction()}
              title="Logout"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
