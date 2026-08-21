export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export type ConversationType = "direct" | "group";

export interface Message {
  _id: string;
  conversation: string | Conversation;
  sender: User | string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  type: ConversationType;
  name?: string;
  createdBy?: string;
  admins?: string[];
  participants: User[] | string[];
  participant?: User;
  lastMessage?: Message | Record<string, unknown>;
  updatedAt: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  phone: string;
  name: string;
}

export interface CreateGroupPayload {
  name: string;
  participantIds: string[];
}

export interface AddGroupMembersPayload {
  userIds: string[];
}

export interface SendMessagePayload {
  conversationId: string;
  text: string;
}
