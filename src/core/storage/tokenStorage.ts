import * as SecureStore from "expo-secure-store";

// SecureStore stores sensitive values more safely than AsyncStorage.
// We use it for access token and refresh token.

const ACCESS_TOKEN_KEY = "User_access_token";
const OPT_KEY = "OPT_KEY";

export const tokenStorage = {
  async saveTokens(accessToken: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  },

  async saveOtpKey(OtpKey: string) {
    await SecureStore.setItemAsync(OPT_KEY, OtpKey);
  },


  
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  
  async getOtpKey() {
    
    return SecureStore.getItemAsync(OPT_KEY);
  },
  // async getRefreshToken() {
  //   return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  // },

  async clearTokens() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(OPT_KEY);
  },
};
