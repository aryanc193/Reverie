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

export interface AiService {
  analyzeEntry(input: MemoryAnalysisInput): Promise<ReflectionAnalysis>;
  embed(text: string): Promise<string>;
}
