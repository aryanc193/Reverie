import request from "supertest";
import { Express } from "express";
import createApp from "../app";

export function getTestApp(): Express {
  return createApp();
}

export async function registerAndLogin(app: Express) {
  const username = `user_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = "password123";

  await request(app).post("/api/v1/auth/register").send({
    username,
    email,
    password,
  });

  const loginRes = await request(app).post("/api/v1/auth/login").send({
    username,
    password,
  });

  return {
    username,
    email,
    password,
    accessToken: loginRes.body.accessToken as string,
    refreshToken: loginRes.body.refreshToken as string,
  };
}

export function authHeader(token: string) {
  return { Authorization: token };
}
