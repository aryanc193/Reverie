export interface ReflectionAnalysis {
  summary: string;
  emotions: string[];
  themes: string[];
}

export interface AiService {
  analyzeEntry(content: string): Promise<ReflectionAnalysis>;
  embed(text: string): Promise<string>;
}
