import { Types } from "mongoose";
import { IMemory } from "../../memory/memory.model";
import { rankRelevantMemories } from "../../utils/relevance";

function makeMemory(overrides: Partial<IMemory>): IMemory {
  return {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    richTextContent: "Default content",
    tags: [],
    important: false,
    processingStatus: "done",
    processingAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as IMemory;
}

describe("rankRelevantMemories", () => {
  it("ranks memories with matching title and tags higher", () => {
    const memories = [
      makeMemory({
        title: "Work stress journal",
        richTextContent: "Feeling overwhelmed at work today",
        tags: ["work", "stress"],
      }),
      makeMemory({
        title: "Weekend hike",
        richTextContent: "Great weather and calm mind",
        tags: ["health"],
      }),
    ];

    const results = rankRelevantMemories(memories, "work stress", ["work"]);

    expect(results).toHaveLength(1);
    expect(results[0].memory.title).toBe("Work stress journal");
    expect(results[0].matchedTags).toContain("work");
    expect(results[0].score).toBeGreaterThan(0);
  });

  it("returns empty array when nothing matches", () => {
    const memories = [
      makeMemory({
        title: "Random entry",
        richTextContent: "Nothing relevant here",
        tags: ["travel"],
      }),
    ];

    const results = rankRelevantMemories(memories, "finance budget", ["finance"]);

    expect(results).toHaveLength(0);
  });
});
