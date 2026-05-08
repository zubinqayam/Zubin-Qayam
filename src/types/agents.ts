export enum AgentType {
  ORCHESTRATOR = 'ORCHESTRATOR',
  INGESTION = 'INGESTION',
  VALIDATION = 'VALIDATION',
  COMPLIANCE = 'COMPLIANCE',
  RANKING = 'RANKING',
  FORECASTING = 'FORECASTING',
  CONTRADICTION = 'CONTRADICTION',
  GOVERNANCE = 'GOVERNANCE',
  DEPLOYMENT = 'DEPLOYMENT'
}

export interface AgentManifest {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  capabilities: string[];
  matrixAssignment: 'DIM' | 'NEM' | 'ADMM' | 'GPM' | 'FALM';
}

export const AGENT_REGISTRY: AgentManifest[] = [
  {
    id: 'ingestion-01',
    type: AgentType.INGESTION,
    name: 'Ingestion Sentinel',
    description: 'Handles high-fidelity data extraction and rate-limit management.',
    status: 'active',
    capabilities: ['web-scraping', 'api-connector', 'stream-ingestion'],
    matrixAssignment: 'DIM'
  },
  {
    id: 'validation-01',
    type: AgentType.VALIDATION,
    name: 'Integrity Warden',
    description: 'Validates data artifacts against SHA-256 truth chains.',
    status: 'active',
    capabilities: ['merkle-validation', 'schema-enforcement', 'artifact-hashing'],
    matrixAssignment: 'NEM'
  },
  {
    id: 'compliance-01',
    type: AgentType.COMPLIANCE,
    name: 'Compliance Arbiter',
    description: 'Enforces regional data protection and privacy guardrails.',
    status: 'active',
    capabilities: ['privacy-masking', 'legal-audit', 'consent-tracking'],
    matrixAssignment: 'NEM'
  },
  {
    id: 'ranking-01',
    type: AgentType.RANKING,
    name: 'Significance Ranker',
    description: 'Prioritizes operational intelligence based on utility and impact.',
    status: 'active',
    capabilities: ['ensemble-scoring', 'priority-routing', 'value-extraction'],
    matrixAssignment: 'ADMM'
  },
  {
    id: 'forecasting-01',
    type: AgentType.FORECASTING,
    name: 'Predictive Seer',
    description: 'Models 6-12 month market gaps and training shifts.',
    status: 'active',
    capabilities: ['time-series-modeling', 'trend-projection', 'anomaly-prediction'],
    matrixAssignment: 'ADMM'
  },
  {
    id: 'contradiction-01',
    type: AgentType.CONTRADICTION,
    name: 'Skeptical Engine',
    description: 'Challenges intelligence nodes to find logical voids or false correlations.',
    status: 'active',
    capabilities: ['logic-checking', 'adversarial-analysis', 'conflict-resolution'],
    matrixAssignment: 'ADMM'
  },
  {
    id: 'governance-01',
    type: AgentType.GOVERNANCE,
    name: 'Sovereign Governor',
    description: 'Manages operational trust boundaries and agent permission lifecycle.',
    status: 'active',
    capabilities: ['rbac-management', 'policy-generation', 'escalation-handling'],
    matrixAssignment: 'GPM'
  },
  {
    id: 'deployment-01',
    type: AgentType.DEPLOYMENT,
    name: 'Infrastructure Relay',
    description: 'Orchestrates Docker/Kubernetes container lifecycles for matrix nodes.',
    status: 'active',
    capabilities: ['k8s-orchestration', 'canary-release', 'health-monitoring'],
    matrixAssignment: 'FALM'
  }
];
