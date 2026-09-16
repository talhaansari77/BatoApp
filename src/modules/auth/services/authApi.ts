import { apiClient } from '../../../core/api/apiClient';
import { tokenStorage } from '../../../core/storage/tokenStorage';

export type UserRole = 'Patient' | 'Doctor' | 'Admin';

export type AuthUser = {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = AuthUser & {
  token: string;
  refreshToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: UserRole;
};

export type MeResponse = {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
};

export const authApi = {
  async login(payload: LoginPayload) {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);

    await tokenStorage.saveTokens(
      response.data.token,
      response.data.refreshToken,
    );

    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);

    await tokenStorage.saveTokens(
      response.data.token,
      response.data.refreshToken,
    );

    return response.data;
  },

  async me() {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  },

  async refresh() {
    const refreshToken = await tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Refresh token is missing');
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    await tokenStorage.saveTokens(
      response.data.token,
      response.data.refreshToken,
    );

    return response.data;
  },

  async logout() {
    const refreshToken = await tokenStorage.getRefreshToken();

    if (refreshToken) {
      await apiClient.post('/auth/logout', {
        refreshToken,
      });
    }

    await tokenStorage.clearTokens();
  },
};