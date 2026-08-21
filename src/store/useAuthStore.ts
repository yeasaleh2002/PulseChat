import { create } from "zustand";
import { User } from "@/types";
import { login as loginApi, getCurrentUser as getCurrentUserApi } from "@/services/chatService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  loginAction: (phone: string, name: string) => Promise<boolean>;
  logoutAction: () => void;
  initAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initAuth: async () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const user = await getCurrentUserApi();
      set({
        user,
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: unknown) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  loginAction: async (phone: string, name: string): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const authData = await loginApi(phone, name);
      set({
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "Authentication failed. Please check your details."
          : "Network error occurred during authentication.";

      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      return false;
    }
  },

  logoutAction: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("activeConversationId");
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
