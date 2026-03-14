export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { msg: string; path: string }[];
}
