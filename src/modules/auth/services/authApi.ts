import { apiClient } from "../../../core/api/apiClient";
import { tokenStorage } from "../../../core/storage/tokenStorage";

export type UserRole = "Patient" | "Doctor" | "Admin";
type Gender = "male" | "female";

export type AuthUser = {
  id: number;
  full_name: string;
  mobile_number: string;
  country_code: string;
  full_mobile_number: string;
  civil_id: string;
  patient_code: string;
};

export type AuthResponse = {
  data: {
    token: string;
    patient: AuthUser;
  };
};
export type OtpResponse = {
  data: {
    mobile_masked: string;
    otp_key: string;
  };
};

export type LoginPayload = {
  otp_key: string;
  otp: string;
};
export type OtpPayload = {
  login_method: string;
  mobile_number: string;
};

export type RegisterPayload = {
  civil_id: string;
  full_name: string;
  mobile_number: string;
  country_code: string;
  dob: string; // YYYY-MM-DD
  gender: string;
  address: string;
  nationality: string;
};

export type MeResponse = {
  data: {
    id: number;
    full_name: string;
    mobile_number: string;
    country_code: string;
    full_mobile_number: string;
    civil_id: string;
    patient_code: string;
    dob: string;
    gender: string;
    address: string;
    nationality: string;
  };
};

export const authApi = {
  async senOtp(payload: OtpPayload) {
    const response = await apiClient.post<OtpResponse>(
      "/patient/send-otp",
      payload,
    );
    // console.log(response.data?.data)

    await tokenStorage.saveOtpKey(response?.data?.data?.otp_key);

    return response.data.data;
  },

  async login(payload: LoginPayload) {
    const response = await apiClient.post<AuthResponse>(
      "/patient/verify-otp",
      payload,
    );

    await tokenStorage.saveTokens(response?.data?.data?.token);

    return response.data.data;
  },

  // /patient/register
  async register(payload: RegisterPayload) {
    
    const response = await apiClient.post<any>(
      "/patient/register",
      payload,
    );

    // await tokenStorage.saveTokens(response?.data?.data?.otp_key);

    return response.data;
  },

  async patientPrifile() {
    const response = await apiClient.get<MeResponse>("/patient/profile");
    return response.data;
  },

  // async refresh() {
  //   const refreshToken = await tokenStorage.getRefreshToken();

  //   if (!refreshToken) {
  //     throw new Error('Refresh token is missing');
  //   }

  //   const response = await apiClient.post<AuthResponse>('/auth/refresh', {
  //     refreshToken,
  //   });

  //   await tokenStorage.saveTokens(
  //     response.data.token,
  //   );

  //   return response.data;
  // },

  async logout() {
    // const refreshToken = await tokenStorage.getRefreshToken();

    // if (refreshToken) {
    //   await apiClient.post('/auth/logout', {
    //     refreshToken,
    //   });
    // }

    await tokenStorage.clearTokens();
  },
};
