import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import * as authApi from "./api/auth";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const ACTIVE_MEMBERSHIP_ID_KEY = "active_membership_id";
export const USER_KEY = "user";

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
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}

export async function storeUser(user: authApi.MeResponse): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<authApi.MeResponse | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as authApi.MeResponse) : null;
}

export async function clearUser(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_KEY);
}

type ForceLogoutListener = () => void;
let forceLogoutListener: ForceLogoutListener | null = null;

export function setForceLogoutListener(listener: ForceLogoutListener | null): void {
  forceLogoutListener = listener;
}

// Endpoints where a 401 is an expected outcome (bad credentials, dead
// pre-auth/reset token, the refresh call itself) rather than a signal that
// the session expired — these must never trigger a refresh attempt.
const AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/verify-reset-otp",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/select-client",
  "/api/v1/auth/logout",
];

function isExcludedFromRefresh(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? "";
  return AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH.some((path) => url.includes(path));
}

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const tokens = await authApi.refresh({ refresh_token: refreshToken });
  await storeTokens(tokens);
  return tokens.access_token;
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
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      isExcludedFromRefresh(originalRequest) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }

    try {
      const newAccessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    } catch {
      await clearTokens();
      forceLogoutListener?.();
      return Promise.reject(error);
    }
  },
);

export default http;
