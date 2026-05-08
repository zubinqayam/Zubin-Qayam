export enum AIProvider {
  OPENAI = 'OpenAI',
  CLAUDE = 'Claude',
  GEMINI = 'Gemini',
  GROK = 'Grok',
  OPENROUTER = 'OpenRouter',
  DEEPSEEK = 'DeepSeek',
  MISTRAL = 'Mistral',
  OLLAMA = 'Ollama Local'
}

export enum RoutingMode {
  MANUAL = 'Manual',
  SMART = 'Smart Routing'
}

export interface ProviderHealth {
  provider: AIProvider;
  status: 'healthy' | 'degraded' | 'down' | 'unconfigured';
  latency: number;
  quotaRemaining?: number;
}

export interface NormalizedAIResponse {
  provider: AIProvider;
  model: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalCost?: number;
  };
  latency: number;
  finishReason: string;
}

export const PROVIDERS = [
  { id: AIProvider.OPENAI, name: 'OpenAI', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: AIProvider.CLAUDE, name: 'Claude', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { id: AIProvider.GEMINI, name: 'Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash'] },
  { id: AIProvider.DEEPSEEK, name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
  { id: AIProvider.OLLAMA, name: 'Ollama Local', models: ['llama-3', 'mistral', 'phi-3'] },
];
