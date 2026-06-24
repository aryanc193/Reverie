import request from "supertest";
import { getTestApp, registerAndLogin, authHeader } from "../helpers";

describe("memory API", () => {
  const app = getTestApp();

  it("creates, lists, updates content invalidation, searches and finds relevant memories", async () => {
    const { accessToken } = await registerAndLogin(app);

    const createRes = await request(app)
      .post("/api/v1/memories/create")
      .set(authHeader(accessToken))
      .send({
        title: "Work stress",
        richTextContent: "Today was overwhelming at work",
        mood: "low",
        tags: ["work", "stress"],
      });

    expect(createRes.status).toBe(201);
    const memoryId = createRes.body._id;

    const listRes = await request(app)
      .get("/api/v1/memories?mood=low&tags=work,stress")
      .set(authHeader(accessToken));

    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const updateRes = await request(app)
      .patch(`/api/v1/memories/${memoryId}`)
      .set(authHeader(accessToken))
      .send({ richTextContent: "Updated work reflection" });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.reflection).toBeUndefined();
    expect(updateRes.body.embeddingId).toBeUndefined();
    expect(updateRes.body.processingStatus).toBe("pending");

    const searchRes = await request(app)
      .get("/api/v1/memories/search?query=work")
      .set(authHeader(accessToken));

    expect(searchRes.status).toBe(200);
    expect(searchRes.body.length).toBeGreaterThan(0);

    const relevantRes = await request(app)
      .get("/api/v1/memories/relevant?query=work%20stress&tags=work")
      .set(authHeader(accessToken));

    expect(relevantRes.status).toBe(200);
    expect(relevantRes.body.retrieval).toBe("stub-text-tag-v1");
    expect(relevantRes.body.results.length).toBeGreaterThan(0);
  });
});
