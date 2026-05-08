export enum ALGAStatus {
  PASS = 'PASS',
  REVIEW = 'REVIEW',
  REJECT = 'REJECT',
  QUARANTINED = 'QUARANTINED'
}

export interface AxisScores {
  accuracy: number;
  logic: number;
  governance: number;
  alignment: number;
}

export interface ClaimEvidence {
  claim: string;
  source?: string;
  isVerified: boolean;
  confidence: number;
}

export interface ALGAReport {
  artifactId: string;
  timestamp: string;
  compositeScore: number;
  axisScores: AxisScores;
  claims: ClaimEvidence[];
  governanceViolations: string[];
  recommendations: string[];
  status: ALGAStatus;
}
