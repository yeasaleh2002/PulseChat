import { create } from "zustand";
import { Conversation, User, Message } from "@/types";
import { socket } from "@/lib/socket";
import {
  getConversations as getConversationsApi,
  searchUsers as searchUsersApi,
  startDirectConversation as startDirectApi,
  getMessageHistory as getMessageHistoryApi,
  sendMessage as sendMessageApi,
  createGroup as createGroupApi,
  addGroupMembers as addGroupMembersApi,
  removeGroupMember as removeGroupMemberApi,
  promoteToAdmin as promoteToAdminApi,
  renameGroup as renameGroupApi,
} from "@/services/chatService";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoadingConversations: boolean;
  isSearching: boolean;
  searchResults: User[];
  searchQuery: string;
  isMobileSidebarOpen: boolean;
  error: string | null;
  unreadCounts: Record<string, number>;

  messagesByConversation: Record<string, Message[]>;
  isLoadingMessages: boolean;
  isLoadingOlderMessages: boolean;
  hasMoreMessages: Record<string, boolean>;

  isSocketConnected: boolean;
  setSocketConnected: (connected: boolean) => void;

  fetchConversations: () => Promise<void>;
  setActiveConversationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  searchUsersAction: (query: string) => Promise<void>;
  startDirectChatAction: (userId: string) => Promise<Conversation | null>;
  setMobileSidebarOpen: (isOpen: boolean) => void;
  toggleMobileSidebar: () => void;
  clearSearchResults: () => void;

  fetchMessagesAction: (conversationId: string, limit?: number) => Promise<void>;
  fetchOlderMessagesAction: (conversationId: string, limit?: number) => Promise<void>;
  sendMessageAction: (conversationId: string, text: string) => Promise<Message | null>;

  createGroupAction: (name: string, participantIds: string[]) => Promise<Conversation | null>;
  addGroupMembersAction: (groupId: string, userIds: string[]) => Promise<Conversation | null>;
  removeGroupMemberAction: (groupId: string, userId: string) => Promise<Conversation | null>;
  promoteToAdminAction: (groupId: string, userId: string) => Promise<Conversation | null>;
  renameGroupAction: (groupId: string, name: string) => Promise<Conversation | null>;

  handleNewMessageRealtime: (newMessage: Message) => void;
  handleConversationUpdatedRealtime: (updatedConversation: Conversation) => void;
  resetChatState: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isLoadingConversations: false,
  isSearching: false,
  searchResults: [],
  searchQuery: "",
  isMobileSidebarOpen: false,
  error: null,
  unreadCounts: {},

  messagesByConversation: {},
  isLoadingMessages: false,
  isLoadingOlderMessages: false,
  hasMoreMessages: {},
  isSocketConnected: false,

  setSocketConnected: (connected) => set({ isSocketConnected: connected }),

  resetChatState: () => set({
    conversations: [],
    activeConversationId: null,
    isLoadingConversations: false,
    isSearching: false,
    searchResults: [],
    searchQuery: "",
    isMobileSidebarOpen: false,
    error: null,
    unreadCounts: {},
    messagesByConversation: {},
    isLoadingMessages: false,
    isLoadingOlderMessages: false,
    hasMoreMessages: {},
  }),

  fetchConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const data = await getConversationsApi();
      set({ conversations: data, isLoadingConversations: false });

      const storedActiveId =
        typeof window !== "undefined" ? localStorage.getItem("activeConversationId") : null;
      const currentActiveId = get().activeConversationId;
      let targetId: string | null = null;
      if (currentActiveId && data.some((c) => c._id === currentActiveId)) {
        targetId = currentActiveId;
      } else if (storedActiveId && data.some((c) => c._id === storedActiveId)) {
        targetId = storedActiveId;
      }

      if (targetId) {
        get().setActiveConversationId(targetId);
      }
    } catch (err: unknown) {
      set({
        isLoadingConversations: false,
        error: "Failed to load conversations.",
      });
    }
  },

  setActiveConversationId: (id) => {
    if (typeof window !== "undefined") {
      if (id) {
        localStorage.setItem("activeConversationId", id);
      } else {
        localStorage.removeItem("activeConversationId");
      }
    }
    set((state) => ({
      activeConversationId: id,
      isMobileSidebarOpen: false,
      unreadCounts: id ? { ...state.unreadCounts, [id]: 0 } : state.unreadCounts,
    }));
    if (id) {
      get().fetchMessagesAction(id, 20);
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  searchUsersAction: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    set({ isSearching: true, error: null });
    try {
      const users = await searchUsersApi(query);
      set({ searchResults: users, isSearching: false });
    } catch (err: unknown) {
      set({ searchResults: [], isSearching: false });
    }
  },

  startDirectChatAction: async (userId: string) => {
    try {
      const conversation = await startDirectApi(userId);
      const { conversations } = get();

      const exists = conversations.some((c) => c._id === conversation._id);
      const updatedList = exists
        ? conversations.map((c) => (c._id === conversation._id ? conversation : c))
        : [conversation, ...conversations];

      set({
        conversations: updatedList,
        activeConversationId: conversation._id,
        searchQuery: "",
        searchResults: [],
        isMobileSidebarOpen: false,
      });

      get().fetchMessagesAction(conversation._id, 20);
      return conversation;
    } catch (err: unknown) {
      set({ error: "Could not start direct conversation." });
      return null;
    }
  },

  fetchMessagesAction: async (conversationId: string, limit = 20) => {
    set({ isLoadingMessages: true, error: null });
    try {
      const fetchedMessages = await getMessageHistoryApi(conversationId, limit);
      const sorted = [...fetchedMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      set((state) => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: sorted,
        },
        hasMoreMessages: {
          ...state.hasMoreMessages,
          [conversationId]: fetchedMessages.length >= limit,
        },
        isLoadingMessages: false,
      }));
    } catch (err: unknown) {
      set({ isLoadingMessages: false, error: "Failed to load messages." });
    }
  },

  fetchOlderMessagesAction: async (conversationId: string, limit = 20) => {
    const { messagesByConversation, isLoadingOlderMessages, hasMoreMessages } = get();

    if (isLoadingOlderMessages || hasMoreMessages[conversationId] === false) {
      return;
    }

    const currentMsgs = messagesByConversation[conversationId] || [];
    if (currentMsgs.length === 0) return;

    const oldestMessage = currentMsgs[0];
    const beforeCursor = oldestMessage.createdAt;

    set({ isLoadingOlderMessages: true });
    try {
      const olderMessages = await getMessageHistoryApi(
        conversationId,
        limit,
        beforeCursor
      );

      if (olderMessages.length === 0) {
        set((state) => ({
          hasMoreMessages: { ...state.hasMoreMessages, [conversationId]: false },
          isLoadingOlderMessages: false,
        }));
        return;
      }

      const sortedOlder = [...olderMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      set((state) => {
        const existing = state.messagesByConversation[conversationId] || [];
        const existingIds = new Set(existing.map((m) => m._id));
        const filteredNew = sortedOlder.filter((m) => !existingIds.has(m._id));

        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...filteredNew, ...existing],
          },
          hasMoreMessages: {
            ...state.hasMoreMessages,
            [conversationId]: olderMessages.length >= limit,
          },
          isLoadingOlderMessages: false,
        };
      });
    } catch (err: unknown) {
      set({ isLoadingOlderMessages: false });
    }
  },

  sendMessageAction: async (conversationId: string, text: string) => {
    if (!text.trim()) return null;

    try {
      const newMessage = await sendMessageApi(conversationId, text.trim());

      set((state) => {
        const existing = state.messagesByConversation[conversationId] || [];
        const isDuplicate = existing.some((m) => {
          if (m._id && newMessage._id && m._id === newMessage._id) return true;
          if (m.text && newMessage.text && m.text.trim() === newMessage.text.trim()) {
            const t1 = new Date(m.createdAt).getTime();
            const t2 = new Date(newMessage.createdAt).getTime();
            if (!isNaN(t1) && !isNaN(t2) && Math.abs(t1 - t2) < 5000) return true;
          }
          return false;
        });

        const updatedMsgs = isDuplicate ? existing : [...existing, newMessage];

        const updatedConversations = state.conversations.map((c) => {
          if (c._id === conversationId) {
            return {
              ...c,
              lastMessage: newMessage,
              updatedAt: newMessage.createdAt,
            };
          }
          return c;
        });

        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: updatedMsgs,
          },
          conversations: updatedConversations,
        };
      });

      return newMessage;
    } catch (err: unknown) {
      set({ error: "Failed to send message." });
      return null;
    }
  },

  createGroupAction: async (name: string, participantIds: string[]) => {
    try {
      const newGroup = await createGroupApi(name, participantIds);
      set((state) => ({
        conversations: [newGroup, ...state.conversations],
        activeConversationId: newGroup._id,
      }));
      return newGroup;
    } catch (err: unknown) {
      set({ error: "Failed to create group." });
      return null;
    }
  },

  addGroupMembersAction: async (groupId: string, userIds: string[]) => {
    try {
      const updatedGroup = await addGroupMembersApi(groupId, userIds);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === groupId ? updatedGroup : c
        ),
      }));
      return updatedGroup;
    } catch (err: unknown) {
      set({ error: "Failed to add group members." });
      return null;
    }
  },

  removeGroupMemberAction: async (groupId: string, userId: string) => {
    try {
      const updatedGroup = await removeGroupMemberApi(groupId, userId);
      set((state) => {
        const { activeConversationId, conversations } = state;
        const currentUserId = typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("user") || "{}")._id
          : null;

        if (userId === currentUserId) {
          return {
            conversations: conversations.filter((c) => c._id !== groupId),
            activeConversationId:
              activeConversationId === groupId ? null : activeConversationId,
          };
        }

        return {
          conversations: conversations.map((c) => (c._id === groupId ? updatedGroup : c)),
        };
      });
      return updatedGroup;
    } catch (err: unknown) {
      set({ error: "Failed to remove group member." });
      return null;
    }
  },

  promoteToAdminAction: async (groupId: string, userId: string) => {
    try {
      const updatedGroup = await promoteToAdminApi(groupId, userId);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === groupId ? updatedGroup : c
        ),
      }));
      return updatedGroup;
    } catch (err: unknown) {
      set({ error: "Failed to promote member to admin." });
      return null;
    }
  },

  renameGroupAction: async (groupId: string, name: string) => {
    try {
      const updatedGroup = await renameGroupApi(groupId, name);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === groupId ? updatedGroup : c
        ),
      }));
      return updatedGroup;
    } catch (err: unknown) {
      set({ error: "Failed to rename group." });
      return null;
    }
  },

  handleNewMessageRealtime: (newMessage: Message) => {
    if (!newMessage) return;

    const extractId = (msg: unknown): string => {
      if (!msg || typeof msg !== "object") return "";
      const m = msg as Record<string, unknown>;
      if (typeof m.conversation === "string") return m.conversation;
      if (m.conversation && typeof m.conversation === "object") {
        const convObj = m.conversation as Record<string, unknown>;
        if (convObj._id) return String(convObj._id);
        if (convObj.id) return String(convObj.id);
      }
      if (m.conversationId) return String(m.conversationId);
      if (m.chatId) return String(m.chatId);
      return "";
    };

    const extractedId = extractId(newMessage);
    const { conversations, activeConversationId } = get();

    let targetConvId = extractedId;

    if (!targetConvId || !conversations.some((c) => c._id === targetConvId)) {
      const senderId =
        typeof newMessage.sender === "object" && newMessage.sender !== null
          ? (newMessage.sender as User)._id
          : String(newMessage.sender || "");

      if (senderId) {
        const matched = conversations.find((c) => {
          if (c.type === "direct") {
            if (
              c.participant &&
              typeof c.participant === "object" &&
              (c.participant as User)._id === senderId
            ) {
              return true;
            }
            if (Array.isArray(c.participants)) {
              return c.participants.some((p) =>
                typeof p === "string" ? p === senderId : p._id === senderId
              );
            }
          }
          return false;
        });
        if (matched) {
          targetConvId = matched._id;
        }
      }
    }

    if (!targetConvId && activeConversationId) {
      targetConvId = activeConversationId;
    }

    if (!targetConvId) {
      get().fetchConversations();
      return;
    }

    set((state) => {
      const existing = state.messagesByConversation[targetConvId] || [];
      const exists = existing.some((m) => {
        if (m._id && newMessage._id && m._id === newMessage._id) return true;
        if (m.text && newMessage.text && m.text.trim() === newMessage.text.trim()) {
          const t1 = new Date(m.createdAt).getTime();
          const t2 = new Date(newMessage.createdAt).getTime();
          if (!isNaN(t1) && !isNaN(t2) && Math.abs(t1 - t2) < 5000) return true;
        }
        return false;
      });

      const updatedMsgs = exists
        ? existing
        : [...existing, newMessage].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

      let conversationFound = false;
      const updatedConversations = state.conversations.map((c) => {
        if (c._id === targetConvId) {
          conversationFound = true;
          return {
            ...c,
            lastMessage: newMessage,
            updatedAt: newMessage.createdAt,
          };
        }
        return c;
      });

      if (!conversationFound) {
        get().fetchConversations();
      }

      const isUnread = targetConvId !== state.activeConversationId;
      const currentUnread = state.unreadCounts[targetConvId] || 0;
      const updatedUnreadCounts = isUnread && !exists
        ? { ...state.unreadCounts, [targetConvId]: currentUnread + 1 }
        : state.unreadCounts;

      return {
        messagesByConversation: {
          ...state.messagesByConversation,
          [targetConvId]: updatedMsgs,
        },
        conversations: updatedConversations,
        unreadCounts: updatedUnreadCounts,
      };
    });
  },

  handleConversationUpdatedRealtime: (updatedConversation: Conversation) => {
    set((state) => {
      const exists = state.conversations.some((c) => c._id === updatedConversation._id);
      const updatedList = exists
        ? state.conversations.map((c) =>
            c._id === updatedConversation._id ? updatedConversation : c
          )
        : [updatedConversation, ...state.conversations];

      return {
        conversations: updatedList,
      };
    });
  },

  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  clearSearchResults: () => set({ searchResults: [], searchQuery: "" }),
}));
