import { create } from "zustand";

import {
  authApi,
  AuthUser,
  LoginPayload,
  LoginViaFilePayload,
  OtpPayload,
  RegisterPayload,
} from "../services/authApi";
import { tokenStorage } from "../../../core/storage/tokenStorage";
import { User } from "lucide-react-native";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type SendOtpResponse = {
  mobile_masked: string;
  otp_key: string;
};

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;

  bootstrapAuth: () => Promise<void>;
  sendOtp: (payload: OtpPayload) => Promise<SendOtpResponse>;
  login: (payload: LoginPayload) => Promise<any>;
  loginViaFile: (payload: LoginViaFilePayload) => Promise<any>;
  register: (payload: RegisterPayload) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<AuthUser> & Record<string, any>) => void;
  clearError: () => void;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "checking",
  isLoading: false,
  error: null,

  // Runs when app starts.
  // If saved token exists, we call /auth/me to restore user session.
  bootstrapAuth: async () => {
    try {
      set({
        status: "checking",
        isLoading: true,
        error: null,
      });

      const accessToken = await tokenStorage.getAccessToken();
      console.log(accessToken);
      if (!accessToken) {
        set({
          user: null,
          status: "unauthenticated",
          isLoading: false,
        });
        return;
      }

      const me = await authApi.patientProfile();
      console.log(me);
      set({
        user: me.data,
        status: "authenticated",
        isLoading: false,
      });
    } catch (error) {
      await tokenStorage.clearTokens();

      set({
        user: null,
        status: "unauthenticated",
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  // sending and opt with secure opt_key
  sendOtp: async (payload) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const data = await authApi.senOtp(payload);

      //need to review this
      set({
        status: "authenticated",
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
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
        user: data?.patient,
        status: "authenticated",
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  loginViaFile: async (payload) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const data = await authApi.loginViaFile(payload);

      set({
        user: data?.patient,
        status: "authenticated",
        isLoading: false,
      });

      return data;
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

      console.log('data')
      console.log(data)

      set({
        status: "unauthenticated",
        isLoading: false,
      });
      return data;
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
        status: "unauthenticated",
        isLoading: false,
      });
    }
  },

  updateUser: (updatedFields: Partial<AuthUser> & Record<string, any>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    }));
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
