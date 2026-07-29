import axios, { type AxiosError } from "axios";
import type {
  ApiErrorBody,
  ApiResponse,
  AuthResponse,
  RefreshResponse,
  ResetOtpResponse,
  User,
  AuthTokens,
} from "@/types";
import { ApiError } from "@/lib/api-error";

const STORAGE_KEYS = {
  user: "auth_user",
  refreshToken: "auth_refresh_token",
} as const;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let _accessToken: string | null = null;

// ── Session helpers ────────────────────────────────────────────────────────

export function setSession(user: User, tokens: AuthTokens) {
  _accessToken = tokens.accessToken;
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
}

export function clearSession() {
  _accessToken = null;
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
}

export function getStoredSession(): { user: User; refreshToken: string } | null {
  const userRaw = localStorage.getItem(STORAGE_KEYS.user);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!userRaw || !refreshToken) return null;
  try {
    return { user: JSON.parse(userRaw) as User, refreshToken };
  } catch {
    return null;
  }
}

// ── Interceptors ───────────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

// Converts every API error into ApiError so hooks always get err.message from the server
api.interceptors.response.use(
  (response) => response,
  (err: AxiosError<ApiErrorBody>) => {
    const message = err.response?.data?.message ?? "Something went wrong";
    const statusCode = err.response?.status ?? 500;
    const extra = err.response?.data?.extra ?? null;
    return Promise.reject(new ApiError(message, statusCode, extra));
  },
);

// ── Token refresh ──────────────────────────────────────────────────────────

export type RefreshResult = "ok" | "invalid" | "error";

export async function refreshAccessToken(): Promise<RefreshResult> {
  const stored = getStoredSession();
  if (!stored) return "invalid";
  try {
    const { data } = await api.get<RefreshResponse>("/auth/get-access-token", {
      headers: { Authorization: `Bearer ${stored.refreshToken}` },
    });
    _accessToken = data.data.accessToken;
    return "ok";
  } catch (err) {
    if (err instanceof ApiError && (err.statusCode === 401 || err.statusCode === 403)) {
      return "invalid";
    }
    return "error";
  }
}

// ── Auth API calls ─────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function loginWithGoogle(credential: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/google-login", { credential });
  return data;
}

export function updateStoredUser(user: User) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export async function verifyAccount(email: string, otp: string): Promise<ApiResponse<User>> {
  const { data } = await api.patch<ApiResponse<User>>("/auth/verify-account", { email, otp });
  return data;
}

export async function logoutUser(): Promise<ApiResponse<{ message: string }>> {
  const { data } = await api.get<ApiResponse<{ message: string }>>("/auth/logout");
  return data;
}

export async function forgotPassword(email: string): Promise<ApiResponse<null>> {
  const { data } = await api.post<ApiResponse<null>>("/auth/forgot-password", { email });
  return data;
}

export async function verifyResetOtp(email: string, otp: string): Promise<ResetOtpResponse> {
  const { data } = await api.post<ResetOtpResponse>("/auth/verify-reset-otp", { email, otp });
  return data;
}

export async function resetPassword(
  resetToken: string,
  newPassword: string,
): Promise<ApiResponse<null>> {
  const { data } = await api.post<ApiResponse<null>>("/auth/reset-password", {
    resetToken,
    newPassword,
  });
  return data;
}

export async function registerUser(
  fields: { name: string; email: string; password: string; uniqueAccName: string; phone?: string },
  image?: File,
): Promise<ApiResponse<User>> {
  const formData = new FormData();
  formData.append("name", fields.name);
  formData.append("email", fields.email);
  formData.append("password", fields.password);
  formData.append("uniqueAccName", fields.uniqueAccName);
  if (fields.phone) formData.append("phone", fields.phone);
  if (image) formData.append("image", image);

  const { data } = await api.post<ApiResponse<User>>("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
