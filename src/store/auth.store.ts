import { create } from 'zustand';

import {
  authApi,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../modules/auth/services/authApi';
import { tokenStorage } from '../core/storage/tokenStorage';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;

  bootstrapAuth: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'checking',
  isLoading: false,
  error: null,

  // Runs when app starts.
  // If saved token exists, we call /auth/me to restore user session.
  bootstrapAuth: async () => {
    try {
      set({
        status: 'checking',
        isLoading: true,
        error: null,
      });

      const accessToken = await tokenStorage.getAccessToken();

      if (!accessToken) {
        set({
          user: null,
          status: 'unauthenticated',
          isLoading: false,
        });
        return;
      }

      const me = await authApi.me();

      set({
        user: {
          userId: me.userId,
          fullName: me.fullName,
          email: me.email,
          role: me.role,
        },
        status: 'authenticated',
        isLoading: false,
      });
    } catch (error) {
      await tokenStorage.clearTokens();

      set({
        user: null,
        status: 'unauthenticated',
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  login: async (payload) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const data = await authApi.login(payload);

      set({
        user: {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
        status: 'authenticated',
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  register: async (payload) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const data = await authApi.register(payload);

      set({
        user: {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
        status: 'authenticated',
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  logout: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      await authApi.logout();
    } finally {
      set({
        user: null,
        status: 'unauthenticated',
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));