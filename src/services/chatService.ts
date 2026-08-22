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
  const trimmed = q.trim();
  if (!trimmed) return [];

  const cleanDigits = trimmed.replace(/\D/g, "");
  const sanitizedQuery = trimmed.replace(/[\+\*\?\^\$\(\)\[\]\{\}\|]/g, "").trim();

  const queriesToTry: string[] = [];
  if (sanitizedQuery) {
    queriesToTry.push(sanitizedQuery);
  }
  if (cleanDigits && cleanDigits !== sanitizedQuery) {
    queriesToTry.push(cleanDigits);
  }
  queriesToTry.push("");

  const fetchForQuery = async (queryStr: string): Promise<User[]> => {
    try {
      const url = queryStr ? `/users/search?q=${encodeURIComponent(queryStr)}` : `/users/search`;
      const response = await api.get<unknown>(url);
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
    } catch (err: unknown) {
      return [];
    }
    return [];
  };

  const resultsArray = await Promise.all(queriesToTry.map(fetchForQuery));
  const combined = resultsArray.flat();

  const userMap = new Map<string, User>();
  for (const u of combined) {
    if (u && u._id) {
      userMap.set(u._id, u);
    }
  }

  const allUsers = Array.from(userMap.values());
  const lowerQuery = trimmed.toLowerCase();

  return allUsers.filter((u) => {
    if (!u) return false;
    const nameMatch = u.name ? u.name.toLowerCase().includes(lowerQuery) : false;
    const rawPhone = u.phone ? u.phone.toLowerCase() : "";
    const phoneMatch = rawPhone.includes(lowerQuery);

    let digitsPhoneMatch = false;
    if (cleanDigits.length > 0 && u.phone) {
      const uDigits = u.phone.replace(/\D/g, "");
      digitsPhoneMatch = uDigits.includes(cleanDigits);
    }

    return nameMatch || phoneMatch || digitsPhoneMatch;
  });
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

async function triggerRevalidateTag(tag: string) {
  try {
    if (typeof window !== "undefined") {
      fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag }),
      }).catch(() => {});
    }
  } catch (err: unknown) {
    // Non-blocking background revalidation call
  }
}

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<Message> {
  const response = await api.post<Message>("/messages", {
    conversationId,
    text,
  });
  triggerRevalidateTag("messages");
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
  triggerRevalidateTag("conversations");
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
