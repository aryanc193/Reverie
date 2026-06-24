import request from "supertest";
import { getTestApp, registerAndLogin, authHeader } from "../helpers";

describe("conversation API", () => {
  const app = getTestApp();

  it("creates a conversation and appends stub assistant reply", async () => {
    const { accessToken } = await registerAndLogin(app);

    const createRes = await request(app)
      .post("/api/v1/conversations")
      .set(authHeader(accessToken))
      .send({ title: "Check-in" });

    expect(createRes.status).toBe(201);
    const conversationId = createRes.body._id;

    const messageRes = await request(app)
      .post(`/api/v1/conversations/${conversationId}/messages`)
      .set(authHeader(accessToken))
      .send({ content: "I feel scattered lately" });

    expect(messageRes.status).toBe(200);
    expect(messageRes.body.messages).toHaveLength(2);
    expect(messageRes.body.messages[0].role).toBe("user");
    expect(messageRes.body.messages[1].role).toBe("assistant");
  });
});
