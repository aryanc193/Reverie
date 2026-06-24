import request from "supertest";
import { getTestApp, authHeader } from "../helpers";

describe("auth API", () => {
  const app = getTestApp();

  it("registers, logs in, returns me, refreshes and logs out", async () => {
    const username = "alice";
    const email = "alice@example.com";
    const password = "password123";

    const registerRes = await request(app)
      .post("/api/v1/auth/register")
      .send({ username, email, password });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.accessToken).toBeDefined();
    expect(registerRes.body.refreshToken).toBeDefined();

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ username, password });

    expect(loginRes.status).toBe(200);
    const { accessToken, refreshToken } = loginRes.body;

    const meRes = await request(app)
      .get("/api/v1/auth/me")
      .set(authHeader(accessToken));

    expect(meRes.status).toBe(200);
    expect(meRes.body.username).toBe(username);
    expect(meRes.body.email).toBe(email);

    const refreshRes = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.accessToken).toBeDefined();
    expect(refreshRes.body.refreshToken).toBeDefined();
    expect(refreshRes.body.refreshToken).not.toBe(refreshToken);

    const logoutRes = await request(app)
      .post("/api/v1/auth/logout")
      .send({ refreshToken: refreshRes.body.refreshToken });

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.success).toBe(true);
  });
});
