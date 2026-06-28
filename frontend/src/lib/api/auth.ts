import { apiFetch } from "./client";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export function login(input: LoginInput) {
  return apiFetch<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput) {
  return apiFetch<AuthTokens>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function refresh(refreshToken: string) {
  return apiFetch<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function logout(refreshToken: string) {
  return apiFetch<{ success: boolean }>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function getMe(token: string) {
  return apiFetch<PublicUser>("/auth/me", { token });
}
