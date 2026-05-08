import { AIProvider, NormalizedAIResponse } from '../types/orchestrator';
import { AgentType, AGENT_REGISTRY, AgentManifest } from '../types/agents';

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

/**
 * Governance & Policy Matrix (GPM)
 * Enforces operational trust, risk scoring, and action authorization.
 */
export class GPM {
  static validate(provider: AIProvider, prompt: string, response: string): { 
    isAuthorized: boolean; 
    riskScore: number; 
    reason: string;
    trustScore: number;
  } {
    const riskIndicators = ['delete', 'destroy', 'transfer', 'drop', 'execute'];
    const lowerPrompt = prompt.toLowerCase();
    
    const riskFactor = riskIndicators.filter(i => lowerPrompt.includes(i)).length;
    const riskScore = Math.min(riskFactor * 25, 100);
    
    const trustScore = provider === AIProvider.OLLAMA ? 95 : 82; // Local is trusted more for data privacy

    return {
      isAuthorized: riskScore < 75,
      riskScore,
      reason: riskScore >= 75 ? 'Operation exceeds automated risk threshold (Requires Human-in-the-Loop Approval)' : 'Operational Intent Within Safety Boundaries',
      trustScore
    };
  }
}

/**
 * ZQ Taskmaster
 * Assigns tasks to specialized agents based on operational intent.
 */
export class Taskmaster {
  static assign(prompt: string): AgentManifest[] {
    const lowerPrompt = prompt.toLowerCase();
    const assignments: AgentManifest[] = [];

    // Orchestrator is the default root agent
    const orchestrator = AGENT_REGISTRY.find(a => a.type === AgentType.ORCHESTRATOR);
    if (orchestrator) assignments.push(orchestrator);

    // Ingestion & Harvesting (Matrix 1)
    if (lowerPrompt.includes('fetch') || lowerPrompt.includes('ingest') || lowerPrompt.includes('scrape') || lowerPrompt.includes('news')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.INGESTION);
      if (agent) assignments.push(agent);
    }

    // Validation & Audit (Matrix 1/3)
    if (lowerPrompt.includes('verify') || lowerPrompt.includes('audit') || lowerPrompt.includes('check') || lowerPrompt.includes('validate')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.VALIDATION);
      if (agent) assignments.push(agent);
    }

    // Compliance & Legal (Matrix 1)
    if (lowerPrompt.includes('legal') || lowerPrompt.includes('privacy') || lowerPrompt.includes('compliance')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.COMPLIANCE);
      if (agent) assignments.push(agent);
    }

    // Forecasting & Trends (Matrix 2)
    if (lowerPrompt.includes('future') || lowerPrompt.includes('forecast') || lowerPrompt.includes('predict') || lowerPrompt.includes('trend')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.FORECASTING);
      if (agent) assignments.push(agent);
    }

    // Decision Support & Ranking (Matrix 2)
    if (lowerPrompt.includes('rank') || lowerPrompt.includes('prioritize') || lowerPrompt.includes('choose')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.RANKING);
      if (agent) assignments.push(agent);
    }

    // Logical Consistency & Contradiction (Matrix 3)
    if (lowerPrompt.includes('logic') || lowerPrompt.includes('contradict') || lowerPrompt.includes('challenge')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.CONTRADICTION);
      if (agent) assignments.push(agent);
    }

    // Infrastructure & Deployment (Matrix 3)
    if (lowerPrompt.includes('deploy') || lowerPrompt.includes('launch') || lowerPrompt.includes('k8s')) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.DEPLOYMENT);
      if (agent) assignments.push(agent);
    }

    // Governance Enforcer (Matrix 3)
    if (lowerPrompt.includes('gov') || lowerPrompt.includes('policy') || lowerPrompt.includes('trust') || assignments.length < 2) {
      const agent = AGENT_REGISTRY.find(a => a.type === AgentType.GOVERNANCE);
      if (agent) assignments.push(agent);
    }

    return assignments;
  }
}
