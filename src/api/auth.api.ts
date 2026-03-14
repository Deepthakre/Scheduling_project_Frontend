import api, { clearTokens } from "./axios";
import { AuthResponse } from "../types";

export const authApi = {
  register: async (name: string, email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/register", { name, email, password });
    return res.data;
  },

  verifyEmail: async (email: string, code: string) => {
    const res = await api.post<AuthResponse>("/auth/verify-email", { email, code });
    return res.data;
  },

  resendCode: async (email: string) => {
    const res = await api.post<AuthResponse>("/auth/resend-code", { email });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    if (res.data.accessToken) localStorage.setItem("accessToken", res.data.accessToken);
    if (res.data.refreshToken) localStorage.setItem("refreshToken", res.data.refreshToken);
    if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearTokens();
    }
  },

  getProfile: async () => {
    const res = await api.get<AuthResponse>("/auth/profile");
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post<AuthResponse>("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/reset-password", { token, password });
    return res.data;
  },

  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/google`;
  },
};
