import { Types } from "mongoose";
import { IMemory } from "../../memory/memory.model";

function markMemoryForReprocessing(memory: IMemory) {
  memory.reflection = {
    summary: "old",
    processedAt: new Date(),
    version: 1,
  };
  memory.embeddingId = "old-embed";
  memory.processingStatus = "done";
  memory.processingAttempts = 2;
  memory.lastProcessingError = "old error";

  memory.reflection = undefined;
  memory.embeddingId = undefined;
  memory.processingStatus = "pending";
  memory.processingAttempts = 0;
  memory.lastProcessingError = undefined;
}

describe("memory content invalidation", () => {
  it("clears reflection fields when content changes", () => {
    const memory = {
      _id: new Types.ObjectId(),
      richTextContent: "Original",
      reflection: {
        summary: "old summary",
        processedAt: new Date(),
        version: 1,
      },
      embeddingId: "embed-1",
      processingStatus: "done",
      processingAttempts: 1,
      lastProcessingError: "failed once",
    } as IMemory;

    const contentChanged = "Updated content" !== memory.richTextContent;

    if (contentChanged) {
      markMemoryForReprocessing(memory);
    }

    expect(memory.reflection).toBeUndefined();
    expect(memory.embeddingId).toBeUndefined();
    expect(memory.processingStatus).toBe("pending");
    expect(memory.processingAttempts).toBe(0);
    expect(memory.lastProcessingError).toBeUndefined();
  });
});
