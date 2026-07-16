// ── Generic response wrappers ──────────────────────────────────────────────

/** Shape returned by every successResponce() call on the backend */
export interface ApiResponse<T = null> {
  status: number;
  message: string;
  data: T;
}

/** Shape returned by globalErrorHandler on the backend */
export interface ApiErrorBody {
  status: false;
  message: string;
  extra: unknown | null;
  stack: string | null;
}

// ── Domain types ───────────────────────────────────────────────────────────

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  uniqueAccName: string;
  role: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface MessageReaction {
  emoji: string;
}

export interface MessageReply {
  content: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender?: string;
  receiver: string;
  Image: string;
  reactions?: MessageReaction[];
  reply?: MessageReply;
  createdAt: string;
  updatedAt: string;
}

// ── API response types ─────────────────────────────────────────────────────

export type AuthResponse = ApiResponse<{ user: User; tokens: AuthTokens }>;

export type RefreshResponse = ApiResponse<{ accessToken: string }>;

export type MessageResponse = ApiResponse<Message>;

export type MessagesResponse = ApiResponse<Message[]>;

export interface PublicProfile {
  _id: string;
  name: string;
  uniqueAccName: string;
  profilePicture: string;
}

export type PublicProfileResponse = ApiResponse<PublicProfile>;
