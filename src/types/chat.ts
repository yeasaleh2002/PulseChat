import { User, Message } from "./types";

export type UserStatus = "online" | "offline" | "away" | "busy";

export type MessageType = "text" | "image" | "file" | "system";

export interface ChatRoom {
  id: string;
  name: string;
  isGroup: boolean;
  avatarUrl?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
}
