import { stubAiService } from "../../services/ai/ai.stub";

describe("StubAiService", () => {
  it("returns deterministic reflection analysis", async () => {
    const input = {
      title: "Morning walk",
      richTextContent: "Felt calm after walking",
      mood: "good" as const,
      tags: ["health"],
    };

    const first = await stubAiService.analyzeEntry(input);
    const second = await stubAiService.analyzeEntry(input);

    expect(first.summary).toBe(second.summary);
    expect(first.emotions.length).toBeGreaterThan(0);
    expect(first.themes.length).toBeGreaterThan(0);
  });

  it("generates insight content from memory context", async () => {
    const result = await stubAiService.generateInsight({
      lookbackDays: 7,
      memories: [
        {
          id: "1",
          richTextContent: "Work was intense",
          tags: ["work"],
          themes: ["work"],
          emotions: ["reflective"],
          createdAt: new Date(),
        },
        {
          id: "2",
          richTextContent: "Walk helped me reset",
          tags: ["health"],
          themes: ["health"],
          emotions: ["calm"],
          createdAt: new Date(),
        },
      ],
    });

    expect(result.title).toContain("Weekly insight");
    expect(result.content).toContain("2 entries");
  });
});
