import api from "@/lib/api";
import { User, Conversation, Message, AuthResponse } from "@/types";

export async function login(phone: string, name: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", { phone, name });
  if (response.data?.token && typeof window !== "undefined") {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/auth/me");
  return response.data;
}

export async function searchUsers(q: string): Promise<User[]> {
  const response = await api.get<unknown>("/users/search", {
    params: { q },
  });
  const resData = response.data;
  if (Array.isArray(resData)) return resData;
  if (resData && typeof resData === "object") {
    if ("data" in resData && Array.isArray((resData as { data: User[] }).data)) {
      return (resData as { data: User[] }).data;
    }
    if ("users" in resData && Array.isArray((resData as { users: User[] }).users)) {
      return (resData as { users: User[] }).users;
    }
  }
  return [];
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await api.get<unknown>("/conversations");
  const resData = response.data;
  if (Array.isArray(resData)) return resData;
  if (resData && typeof resData === "object") {
    if ("data" in resData && Array.isArray((resData as { data: Conversation[] }).data)) {
      return (resData as { data: Conversation[] }).data;
    }
    if ("conversations" in resData && Array.isArray((resData as { conversations: Conversation[] }).conversations)) {
      return (resData as { conversations: Conversation[] }).conversations;
    }
  }
  return [];
}

export async function startDirectConversation(userId: string): Promise<Conversation> {
  const response = await api.post<Conversation>("/conversations", { userId });
  return response.data;
}

export async function getMessageHistory(
  id: string,
  limit?: number,
  before?: string
): Promise<Message[]> {
  const params: Record<string, unknown> = {};
  if (limit !== undefined) params.limit = limit;
  if (before !== undefined) params.before = before;

  const response = await api.get<unknown>(`/conversations/${id}/messages`, {
    params,
  });
  const resData = response.data;
  if (Array.isArray(resData)) return resData;
  if (resData && typeof resData === "object") {
    if ("messages" in resData && Array.isArray((resData as { messages: Message[] }).messages)) {
      return (resData as { messages: Message[] }).messages;
    }
    if ("data" in resData && Array.isArray((resData as { data: Message[] }).data)) {
      return (resData as { data: Message[] }).data;
    }
  }
  return [];
}

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<Message> {
  const response = await api.post<Message>("/messages", {
    conversationId,
    text,
  });
  return response.data;
}

export async function createGroup(
  name: string,
  participantIds: string[]
): Promise<Conversation> {
  const response = await api.post<Conversation>("/conversations/group", {
    name,
    participantIds,
  });
  return response.data;
}

export async function addGroupMembers(
  groupId: string,
  userIds: string[]
): Promise<Conversation> {
  const response = await api.post<Conversation>(
    `/conversations/${groupId}/participants`,
    { userIds }
  );
  return response.data;
}

export async function removeGroupMember(
  groupId: string,
  userId: string
): Promise<Conversation> {
  const response = await api.delete<Conversation>(
    `/conversations/${groupId}/participants/${userId}`
  );
  return response.data;
}

export async function promoteToAdmin(
  groupId: string,
  userId: string
): Promise<Conversation> {
  const response = await api.post<Conversation>(
    `/conversations/${groupId}/admins`,
    { userId }
  );
  return response.data;
}

export async function renameGroup(
  groupId: string,
  name: string
): Promise<Conversation> {
  const response = await api.patch<Conversation>(`/conversations/${groupId}`, {
    name,
  });
  return response.data;
}

export const chatService = {
  login,
  getCurrentUser,
  searchUsers,
  getConversations,
  startDirectConversation,
  getMessageHistory,
  sendMessage,
  createGroup,
  addGroupMembers,
  removeGroupMember,
  promoteToAdmin,
  renameGroup,
};
