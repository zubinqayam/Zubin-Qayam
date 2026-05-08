import { SearchFilters, SearchResult } from '../types/search';
import { ChatMessage } from '../constants';

export class MemoryEngine {
  /**
   * Simulates a semantic/vector search across context nodes.
   * In a real system, this would call a vector database like Pinecone or Milvus.
   */
  static search(messages: ChatMessage[], filters: SearchFilters): SearchResult[] {
    const { query, startDate, endDate, agentContext, isSemantic } = filters;
    
    if (!query) return [];

    const lowerQuery = query.toLowerCase();

    return messages
      .filter(msg => {
        const matchesContent = msg.content.toLowerCase().includes(lowerQuery);
        
        // Simulating semantic match (returning higher scores for relevant keywords)
        const isSemanticMatch = isSemantic && (
          msg.content.toLowerCase().includes('architecture') || 
          msg.content.toLowerCase().includes('governance') ||
          msg.content.toLowerCase().includes('orchestration')
        );

        if (!matchesContent && !isSemanticMatch) return false;

        // Date filtering (Simplified simulation)
        if (startDate && msg.timestamp < startDate) return false;
        if (endDate && msg.timestamp > endDate) return false;

        return true;
      })
      .map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant' | 'system',
        timestamp: msg.timestamp,
        score: msg.content.toLowerCase().includes(lowerQuery) ? 0.95 : 0.8,
        context: {
          agent: msg.role === 'assistant' ? 'Orchestrator-01' : 'User-Mesh',
          project: 'ZQ_COORDINATOR'
        }
      }))
      .sort((a, b) => b.score - a.score);
  }
}
