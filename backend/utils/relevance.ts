import { IMemory } from "../memory/memory.model";

export interface RelevantMemoryMatch {
  memory: IMemory;
  score: number;
  matchedTags: string[];
  matchReasons: string[];
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "is",
  "it",
  "i",
  "my",
  "me",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function countTokenMatches(tokens: string[], haystack: string): number {
  const normalized = haystack.toLowerCase();
  return tokens.filter((token) => normalized.includes(token)).length;
}

function recencyBonus(createdAt: Date): number {
  const ageDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 7) return 1;
  if (ageDays <= 30) return 0.5;
  return 0;
}

export function scoreMemoryRelevance(
  memory: IMemory,
  query: string,
  filterTags: string[] = [],
): RelevantMemoryMatch | null {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return null;
  }

  const title = memory.title ?? "";
  const content = memory.richTextContent;
  const themes = memory.reflection?.themes ?? [];
  const emotions = memory.reflection?.emotions ?? [];

  const titleMatches = countTokenMatches(queryTokens, title);
  const contentMatches = countTokenMatches(queryTokens, content);
  const themeMatches = countTokenMatches(queryTokens, themes.join(" "));
  const emotionMatches = countTokenMatches(queryTokens, emotions.join(" "));

  const memoryTags = memory.tags.map((tag) => tag.toLowerCase());
  const queryTagMatches = queryTokens.filter((token) =>
    memoryTags.includes(token),
  );
  const explicitTagMatches = filterTags
    .map((tag) => tag.toLowerCase())
    .filter((tag) => memoryTags.includes(tag));

  const matchedTags = [
    ...new Set([...queryTagMatches, ...explicitTagMatches]),
  ];

  let score =
    titleMatches * 3 +
    contentMatches * 2 +
    themeMatches * 2 +
    emotionMatches * 1 +
    matchedTags.length * 4 +
    recencyBonus(memory.createdAt);

  const matchReasons: string[] = [];
  if (titleMatches > 0) matchReasons.push("title match");
  if (contentMatches > 0) matchReasons.push("content match");
  if (themeMatches > 0) matchReasons.push("theme match");
  if (emotionMatches > 0) matchReasons.push("emotion match");
  if (matchedTags.length > 0) matchReasons.push("tag overlap");
  if (memory.embeddingId) matchReasons.push("embedding stub available");

  if (filterTags.length > 0 && explicitTagMatches.length === 0) {
    return null;
  }

  if (score <= 0) {
    return null;
  }

  return {
    memory,
    score: Number(score.toFixed(2)),
    matchedTags,
    matchReasons,
  };
}

export function rankRelevantMemories(
  memories: IMemory[],
  query: string,
  filterTags: string[] = [],
): RelevantMemoryMatch[] {
  return memories
    .map((memory) => scoreMemoryRelevance(memory, query, filterTags))
    .filter((result): result is RelevantMemoryMatch => result !== null)
    .sort((a, b) => b.score - a.score || b.memory.createdAt.getTime() - a.memory.createdAt.getTime());
}
