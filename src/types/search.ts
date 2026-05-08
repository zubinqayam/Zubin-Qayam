export interface SearchFilters {
  query: string;
  startDate?: string;
  endDate?: string;
  agentContext?: string[];
  projectScope?: string;
  isSemantic: boolean;
}

export interface SearchResult {
  id: string;
  score: number;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  context: {
    agent?: string;
    project?: string;
  };
}
