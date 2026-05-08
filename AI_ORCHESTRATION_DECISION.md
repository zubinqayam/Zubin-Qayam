# AI Orchestration Layer — Decision Log [ZQ-2026-004]

## Operational Context
As we transition from a conversation-first workstation to an **AI-native operational intelligence platform**, the core challenge has shifted from model connectivity to **governed orchestration**.

## Decision: Multi-Provider Proxy Architecture
**Status: IMPLEMENTED (v0.3.0)**

### The Problem
- **Provider Drift**: Different LLMs follow different markdown/JSON/ToolCall schemas.
- **Secret Leakage**: Client-side API keys are a high-risk liability in enterprise environments.
- **Static Coupling**: Hard-coding a single provider reduces resilience and increases cost-inefficiency.

### The Solution: Layered Orchestration
We have implemented a three-tier orchestration layer:

1.  **Secure Vault (Storage)**: Keys are managed via the Secure AI Vault. Proposing full migration to OS-level keychains (via Tauri Stronghold) in Phase 2.
2.  **Smart Routing Engine (Control)**: Auto-selection of providers based on intent (Coding -> Claude, Fast -> Gemini, Analysis -> OpenAI).
3.  **SOA — Standardized Output Adapter (Normalization)**: Standardizes all AI responses into a unified internal schema before they hit the UI.

### Constraints & Invariants
- **Operational Truthfulness**: Never fake provider health. Use live SSE or polling for status rails.
- **Circuit Breaker**: If a provider latency exceeds 5000ms, auto-fallback to the secondary route must trigger.
- **Encryption**: All keys entered in the UI are handled as `SensitiveString` types.

## Future Evolution (Phase 2 & 3)
- **Lossless Context Bridge**: Summary-based history preserved during model switches.
- **Cost Intelligence**: Live token cost tracking per-provider in the Infrastructure Rail.
- **ALGA Consensus**: Running multi-agent parallel validation on critical responses.

---
*Signed,*
Architect (AI-Orchestration-Lead)
