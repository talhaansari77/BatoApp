import { apiClient } from '../../../core/api/apiClient';
import { tokenStorage } from '../../../core/storage/tokenStorage';

export type UserRole = 'Patient' | 'Doctor' | 'Admin';

export type AuthUser = {
  user_id?:string,
  civil_id: number;
  full_name: string;
  mobile_number: number;
  dob: string;
  gender: string;
  address: string;
  nationality: string;

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
  civil_id: string|undefined;
  full_name: string;
  mobile_number: string|undefined;
  dob?: string;
  gender?: string;
  address?: string;
  nationality?: string;
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
    const response = await apiClient.post<AuthResponse>('/api/patient/send-otp', payload);

    await tokenStorage.saveTokens(
      response.data.token,
      response.data.refreshToken,
    );

    return response.data;
  },

  // /patient/register
  async register(payload: RegisterPayload) {
    const response = await apiClient.post<AuthResponse>('/patient/register', payload);

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