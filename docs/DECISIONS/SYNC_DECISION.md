# Sync Decision: ZQCOORDINATOR Data Persistence & Replication

## Context
ZQCOORDINATOR requires a robust synchronization layer to transition from a single-device local tool to a multi-device, team-capable AI workspace.

## Options

### Option A: Original CRDT-style design
- **Status**: Historical / Deprecated.
- **Goal**: Peer-to-peer eventual consistency using library-level CRDTs.
- **Result**: High architectural complexity and difficulty in enforcing centralized governance/audit requirements for enterprise use.

### Option B: Simplified Local-Only Sync (Current v0.2.0)
- **Status**: Active (Release v0.2.0).
- **Goal**: Stabilize the core orchestration logic by removing sync complexity.
- **Model**: DashMap in-memory store + JSON/SQLite local persistence.
- **Limitation**: No cross-device continuity or durable remote backup.

### Option C: ElectricSQL-backed selective replication
- **Status**: Proposed / Experimental (Post-v0.2.0).
- **Goal**: Evolve to a durable, local-first, multi-device infrastructure.
- **Model**: Hybrid Sync (DashMap Hot Path → SQLite Cache → ElectricSQL → PostgreSQL).
- **Key Advantage**: Standard PostgreSQL truth layer with partial replication (Shapes) and offline-first responsiveness.
- **Migration Path**: Additive integration behind feature flags in `feat/electricsql-sync`.

## Decision
We are moving towards **Option C (ElectricSQL)** for the v0.3.x development line. This allows us to maintain the low-latency UX of ZQCOORDINATOR while enabling the durability and collaboration features required for the INNM-WOSDS ecosystem.

---
*Last Updated: 2026-05-08*
