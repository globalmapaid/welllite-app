import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const ACTIVE_MEMBERSHIP_ID_KEY = "active_membership_id";

export async function storeTokens(tokens: {
  access_token: string;
  refresh_token: string;
}): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access_token),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh_token),
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function getActiveMembershipId(): Promise<string | null> {
  return SecureStore.getItemAsync(ACTIVE_MEMBERSHIP_ID_KEY);
}

export async function setActiveMembershipId(membershipId: string): Promise<void> {
  await SecureStore.setItemAsync(ACTIVE_MEMBERSHIP_ID_KEY, membershipId);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(ACTIVE_MEMBERSHIP_ID_KEY),
  ]);
}

const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(async (config) => {
  if (!config.headers.has("Authorization")) {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearTokens();
    }
    return Promise.reject(error);
  },
);

export default http;
