import { Types } from "mongoose";
import { Memory } from "../../memory/memory.model";
import { processPendingMemories } from "../../services/reflection.service";

describe("reflection worker pipeline", () => {
  it("processes pending memories and writes reflection data", async () => {
    const userId = new Types.ObjectId();

    await Memory.create({
      userId,
      richTextContent: "Worker should process this entry",
      tags: ["test"],
      processingStatus: "pending",
      processingAttempts: 0,
    });

    const { processed, failed } = await processPendingMemories();

    expect(failed).toHaveLength(0);
    expect(processed).toHaveLength(1);
    expect(processed[0].reflection?.summary).toBeDefined();
    expect(processed[0].reflection?.processedAt).toBeDefined();
    expect(processed[0].embeddingId).toMatch(/^stub-embed-/);
    expect(processed[0].processingStatus).toBe("done");
  });
});
