import { ALGAStatus, AxisScores, ALGAReport, ClaimEvidence } from '../types/alga';

export class ALGAEngine {
  /**
   * Evaluates an artifact across the four core axes based on the v2.0 specification.
   * Composite = (0.30 × Accuracy) + (0.25 × Logic) + (0.25 × Governance) + (0.20 × Alignment)
   */
  static evaluate(content: string, context: { query: string; project: string }): ALGAReport {
    const axisScores: AxisScores = {
      accuracy: this.calculateAccuracy(content),
      logic: this.calculateLogic(content),
      governance: this.calculateGovernance(content),
      alignment: this.calculateAlignment(content, context.query)
    };

    let compositeScore = (0.30 * axisScores.accuracy) + 
                         (0.25 * axisScores.logic) + 
                         (0.25 * axisScores.governance) + 
                         (0.20 * axisScores.alignment);

    // Hard Governance Override Rule: If Governance < 90, cap at 79 and force Quarantine
    let status = ALGAStatus.PASS;
    if (axisScores.governance < 90) {
      compositeScore = Math.min(compositeScore, 79);
      status = ALGAStatus.QUARANTINED;
    } else if (compositeScore >= 88) {
      status = ALGAStatus.PASS;
    } else if (compositeScore >= 72) {
      status = ALGAStatus.REVIEW;
    } else {
      status = ALGAStatus.REJECT;
    }

    return {
      artifactId: `artifact-${Date.now()}`,
      timestamp: new Date().toISOString(),
      compositeScore: Math.round(compositeScore),
      axisScores,
      claims: this.extractClaims(content),
      governanceViolations: axisScores.governance < 90 ? ['CRITICAL POLICY VIOLATION: Execution boundary breach detected.'] : [],
      recommendations: this.generateRecommendations(axisScores),
      status
    };
  }

  private static calculateAccuracy(content: string): number {
    // Simulated CoVe/Hallucination detection
    if (content.length < 50) return 70;
    return 85 + Math.random() * 15;
  }

  private static calculateLogic(content: string): number {
    // Simulated contradiction detection
    return 90 + Math.random() * 10;
  }

  private static calculateGovernance(content: string): number {
    // Simulated policy engine
    const keywords = ['delete', 'destroy', 'transfer', 'key'];
    const lower = content.toLowerCase();
    const violation = keywords.some(k => lower.includes(k));
    return violation ? 75 : 98;
  }

  private static calculateAlignment(content: string, query: string): number {
    // Simulated intent match
    return 80 + Math.random() * 20;
  }

  private static extractClaims(content: string): ClaimEvidence[] {
    return [
      { claim: "Operational integrity is maintained.", isVerified: true, confidence: 0.98 },
      { claim: "Distributed consensus active.", isVerified: true, confidence: 0.95 }
    ];
  }

  private static generateRecommendations(scores: AxisScores): string[] {
    const recs = [];
    if (scores.accuracy < 90) recs.push("Verify source citations against WOSDS truth chain.");
    if (scores.governance < 90) recs.push("Escalate to Human-in-the-Loop for policy override.");
    return recs;
  }
}
