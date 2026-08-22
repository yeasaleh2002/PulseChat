"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { Message, Conversation } from "@/types";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuthStore();
  const {
    handleNewMessageRealtime,
    handleConversationUpdatedRealtime,
    setSocketConnected,
  } = useChatStore();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket.connected) {
        socket.disconnect();
      }
      setSocketConnected(false);
      return;
    }

    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setSocketConnected(true);
    };

    const onDisconnect = () => {
      setSocketConnected(false);
    };

    const onNewMessage = (newMessage: Message) => {
      handleNewMessageRealtime(newMessage);
    };

    const onConversationUpdated = (updatedConversation: Conversation) => {
      handleConversationUpdatedRealtime(updatedConversation);
    };

    const onConnectError = (err: Error) => {
      setSocketConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("message:new", onNewMessage);
    socket.on("message", onNewMessage);
    socket.on("new_message", onNewMessage);
    socket.on("newMessage", onNewMessage);
    socket.on("conversation:updated", onConversationUpdated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("message:new", onNewMessage);
      socket.off("message", onNewMessage);
      socket.off("new_message", onNewMessage);
      socket.off("newMessage", onNewMessage);
      socket.off("conversation:updated", onConversationUpdated);
      socket.disconnect();
      setSocketConnected(false);
    };
  }, [
    token,
    isAuthenticated,
    handleNewMessageRealtime,
    handleConversationUpdatedRealtime,
    setSocketConnected,
  ]);

  return <>{children}</>;
}
