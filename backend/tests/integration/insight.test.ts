import request from "supertest";
import { getTestApp, registerAndLogin, authHeader } from "../helpers";

describe("insight API", () => {
  const app = getTestApp();

  it("generates and lists insights when enough memories exist", async () => {
    const { accessToken } = await registerAndLogin(app);

    for (let i = 0; i < 2; i++) {
      await request(app)
        .post("/api/v1/memories/create")
        .set(authHeader(accessToken))
        .send({
          title: `Entry ${i + 1}`,
          richTextContent: `Reflection number ${i + 1}`,
          tags: ["growth"],
        });
    }

    const generateRes = await request(app)
      .post("/api/v1/insights/generate")
      .set(authHeader(accessToken))
      .send({ lookbackDays: 7, minMemories: 2 });

    expect(generateRes.status).toBe(201);
    expect(generateRes.body.title).toBeDefined();
    expect(generateRes.body.sourceMemoryIds.length).toBe(2);

    const listRes = await request(app)
      .get("/api/v1/insights")
      .set(authHeader(accessToken));

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
  });
});
