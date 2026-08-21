"use client";

import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ChatPanel } from "@/components/chat/chat-panel";
import { MessageSquare, Users, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const { user } = useAuthStore();
  const { activeConversationId, conversations, toggleMobileSidebar } = useChatStore();

  const activeConversation = conversations.find((c) => c._id === activeConversationId);

  if (!activeConversationId || !activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/50 dark:bg-slate-950/50 h-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-500/20 to-indigo-500/20 border border-brand-500/30 flex items-center justify-center text-brand-500 animate-pulse">
          <MessageSquare className="w-10 h-10" />
        </div>

        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || "Member"}!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Select a conversation from the sidebar or search for users to initiate a new encrypted real-time chat session.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleMobileSidebar}
            variant="primary"
            size="sm"
            className="md:hidden gap-2"
          >
            <Users className="w-4 h-4" /> Select Conversation
          </Button>
        </div>

        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> End-to-End Encrypted
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Virtualized DOM Ready
          </span>
        </div>
      </div>
    );
  }

  return <ChatPanel conversation={activeConversation} />;
}
