import { AIProvider, NormalizedAIResponse } from '../types/orchestrator';

/**
 * Standardized Output Adapter (SOA)
 * Normalizes disparate provider outputs into a unified internal schema.
 */
export class SOA {
  static normalize(provider: AIProvider, rawResponse: any, latency: number): NormalizedAIResponse {
    switch (provider) {
      case AIProvider.OPENAI:
        return {
          provider,
          model: rawResponse.model,
          content: rawResponse.choices[0].message.content,
          usage: {
            promptTokens: rawResponse.usage.prompt_tokens,
            completionTokens: rawResponse.usage.completion_tokens,
            totalCost: (rawResponse.usage.prompt_tokens * 0.005 + rawResponse.usage.completion_tokens * 0.015) / 1000,
          },
          latency,
          finishReason: rawResponse.choices[0].finish_reason,
        };
      case AIProvider.CLAUDE:
        return {
          provider,
          model: rawResponse.model,
          content: rawResponse.content[0].text,
          usage: {
            promptTokens: rawResponse.usage.input_tokens,
            completionTokens: rawResponse.usage.output_tokens,
          },
          latency,
          finishReason: rawResponse.stop_reason,
        };
      default:
        // Basic fallback normalization
        return {
          provider,
          model: rawResponse.model || 'unknown',
          content: typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse),
          usage: { promptTokens: 0, completionTokens: 0 },
          latency,
          finishReason: 'stop',
        };
    }
  }
}

/**
 * Smart Routing Engine
 * Recommends the optimal provider based on task context.
 */
export class SmartRouter {
  static route(prompt: string, health: any[]): AIProvider {
    const lowerPrompt = prompt.toLowerCase();
    
    // Coding task detections
    if (lowerPrompt.includes('code') || lowerPrompt.includes('function') || lowerPrompt.includes('react')) {
      return AIProvider.CLAUDE;
    }
    
    // Fast/Simple tasks
    if (prompt.length < 100) {
      return AIProvider.GEMINI;
    }
    
    // Enterprise reasoning
    if (lowerPrompt.includes('analyze') || lowerPrompt.includes('strategy')) {
      return AIProvider.OPENAI;
    }
    
    return AIProvider.OPENAI; // Default fallback
  }
}
