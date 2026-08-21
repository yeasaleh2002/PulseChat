"use client";

import { useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import {
  Send,
  Loader2,
  Paperclip,
  Smile,
  ShieldCheck,
  Users,
  CheckCheck,
  ArrowDown,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { GroupSettingsModal } from "./group-settings-modal";
import { formatChatTimestamp, cn } from "@/lib/utils";
import { Message, User, Conversation } from "@/types";

export interface ChatPanelProps {
  conversation: Conversation;
}

export function ChatPanel({ conversation }: ChatPanelProps) {
  const { user } = useAuthStore();
  const {
    messagesByConversation,
    isLoadingMessages,
    isLoadingOlderMessages,
    hasMoreMessages,
    fetchMessagesAction,
    fetchOlderMessagesAction,
    sendMessageAction,
    toggleMobileSidebar,
  } = useChatStore();

  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [isGroupSettingsOpen, setIsGroupSettingsOpen] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const messages = messagesByConversation[conversation._id] || [];
  const hasMore = hasMoreMessages[conversation._id] ?? true;

  useEffect(() => {
    if (!messagesByConversation[conversation._id]) {
      fetchMessagesAction(conversation._id, 20);
    }
  }, [conversation._id, messagesByConversation, fetchMessagesAction]);

  useEffect(() => {
    if (messages.length > 0 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: "auto",
      });
    }
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const textToSend = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    await sendMessageAction(conversation._id, textToSend);
    setIsSending(false);

    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: messages.length,
        behavior: "smooth",
      });
    }, 100);
  };

  const getSenderInfo = (msg: Message) => {
    if (typeof msg.sender === "object" && msg.sender !== null) {
      return {
        name: (msg.sender as User).name || "Member",
        avatar: (msg.sender as User).name?.slice(0, 2).toUpperCase() || "U",
        id: (msg.sender as User)._id,
      };
    }
    return {
      name: "Member",
      avatar: "M",
      id: String(msg.sender),
    };
  };

  const getConversationDisplayTitle = (): string => {
    if (conversation.name) return conversation.name;
    if (
      conversation.participant &&
      typeof conversation.participant === "object" &&
      (conversation.participant as User).name
    ) {
      return (conversation.participant as User).name;
    }
    if (Array.isArray(conversation.participants)) {
      const otherUser = conversation.participants.find(
        (p) => typeof p !== "string" && p._id !== user?._id,
      ) as User | undefined;
      if (otherUser?.name) return otherUser.name;
    }
    return conversation.type === "group" ? "Group Chat" : "Direct Chat";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 min-w-0 relative">
      {/* Group Settings Modal */}
      {conversation.type === "group" && (
        <GroupSettingsModal
          conversation={conversation}
          isOpen={isGroupSettingsOpen}
          onClose={() => setIsGroupSettingsOpen(false)}
        />
      )}

      {/* Header Bar */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Back to conversations list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            className={cn(
              "w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 text-white shadow-sm",
              conversation.type === "group"
                ? "bg-gradient-to-tr from-purple-500 to-indigo-600"
                : "bg-gradient-to-tr from-brand-500 to-blue-600",
            )}
          >
            {conversation.type === "group" ? (
              <Users className="w-4 h-4" />
            ) : (
              getConversationDisplayTitle().slice(0, 2).toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {getConversationDisplayTitle()}
            </h3>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
              Real-time WSS Active
            </span>
          </div>
        </div>

        {/* Group Header Actions */}
        <div className="flex items-center gap-2">
          {conversation.type === "group" && (
            <button
              onClick={() => setIsGroupSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/80 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" /> Group Settings
            </button>
          )}
        </div>
      </div>

      {/* Virtualized Message List Container */}
      <div className="flex-1 relative min-h-0 bg-slate-50/40 dark:bg-slate-950/40">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="h-full flex items-center justify-center space-y-2 text-xs text-slate-400 flex-col">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span>Decrypting message history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-6 text-center space-y-2 text-xs text-slate-400 flex-col">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center">
              <Smile className="w-6 h-6" />
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              No messages in this chat yet.
            </p>
            <p className="text-[11px]">
              Type a message below to start the conversation!
            </p>
          </div>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: "100%", width: "100%" }}
            data={messages}
            initialTopMostItemIndex={Math.max(0, messages.length - 1)}
            startReached={() => {
              if (hasMore && !isLoadingOlderMessages) {
                fetchOlderMessagesAction(conversation._id, 20);
              }
            }}
            atBottomStateChange={(atBottom) => {
              setShowScrollBottomBtn(!atBottom);
            }}
            followOutput="auto"
            components={{
              Header: () => (
                <div className="p-3 text-center">
                  {isLoadingOlderMessages ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono shadow-sm">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />{" "}
                      Loading older messages...
                    </div>
                  ) : hasMore ? (
                    <span className="text-[10px] font-mono text-slate-400">
                      Scroll up to load older history
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">
                      Beginning of message history
                    </span>
                  )}
                </div>
              ),
            }}
            itemContent={(index, msg) => {
              const senderInfo = getSenderInfo(msg);
              const isMe =
                user?._id === senderInfo.id || user?.phone === senderInfo.id;
              const formattedTime = formatChatTimestamp(msg.createdAt);

              return (
                <div
                  className={cn(
                    "flex items-end gap-2 px-4 py-1.5 group",
                    isMe ? "justify-end" : "justify-start",
                  )}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mb-1 shadow-sm">
                      {senderInfo.avatar}
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[78%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed break-words relative",
                      isMe
                        ? "bg-brand-600 dark:bg-brand-500 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800/80 rounded-bl-none",
                    )}
                  >
                    {!isMe && conversation.type === "group" && (
                      <p className="text-[10px] font-semibold text-brand-500 mb-0.5">
                        {senderInfo.name}
                      </p>
                    )}

                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div
                      className={cn(
                        "mt-1 flex items-center justify-end gap-1 text-[10px] font-mono opacity-70",
                        isMe ? "text-brand-100" : "text-slate-400",
                      )}
                    >
                      <span>{formattedTime}</span>
                      {isMe && (
                        <CheckCheck className="w-3 h-3 text-brand-200" />
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        )}

        {showScrollBottomBtn && (
          <button
            onClick={() =>
              virtuosoRef.current?.scrollToIndex({
                index: messages.length - 1,
                behavior: "smooth",
              })
            }
            aria-label="Scroll to latest message"
            className="absolute bottom-4 right-4 p-2.5 rounded-full bg-brand-600 text-white shadow-xl hover:bg-brand-700 transition-all duration-200 z-20 animate-fade-in"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sticky Input Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-slate-400">
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
              title="Insert Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 transition-all"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            aria-label="Send message"
            className={cn(
              "p-2.5 rounded-xl bg-brand-600 text-white font-medium shadow-md shadow-brand-500/25",
              "hover:bg-brand-700 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none active:scale-95",
            )}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
