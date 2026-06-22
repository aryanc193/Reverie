export interface ReflectionAnalysis {
  summary: string;
  emotions: string[];
  themes: string[];
}

export interface MemoryAnalysisInput {
  title?: string;
  richTextContent: string;
  mood?: string;
  tags?: string[];
}

export interface InsightMemoryContext {
  id: string;
  title?: string;
  richTextContent: string;
  mood?: string;
  tags: string[];
  reflectionSummary?: string;
  themes?: string[];
  emotions?: string[];
  createdAt: Date;
}

export interface InsightGenerationInput {
  memories: InsightMemoryContext[];
  lookbackDays: number;
}

export interface InsightGenerationResult {
  title: string;
  content: string;
}

export interface AiService {
  analyzeEntry(input: MemoryAnalysisInput): Promise<ReflectionAnalysis>;
  embed(text: string): Promise<string>;
  generateInsight(
    input: InsightGenerationInput,
  ): Promise<InsightGenerationResult>;
}
