# Sync Strategy: ZQ_COORDINATOR Federated Memory

## Context
ZQ_COORDINATOR requires a replication layer that preserves local-first responsiveness while enabling enterprise-grade durability and multi-device continuity.

## Comparison: PowerSync vs. ElectricSQL

| Feature | PowerSync | ElectricSQL |
|---------|-----------|-------------|
| **Sync Model** | Bidirectional (Reconcile) | Bidirectional (CRDT-inspired) |
| **Partial Replication** | Sync Rules (SQL) | Shapes (SQL-like) |
| **Operational Effort** | Low (Commercial/Managed) | High (Self-hosted Elixir/Postgres) |
| **Local-First Fit** | Excellent (SQLite-centric) | Excellent (Postgres-centric) |
| **Governance Bound** | High (Rules in code) | High (Shapes in DB/App) |

## Strategic Decision: Option C (Hybrid)
We are proceeding with a **Hybrid Governance Model** using the following pipeline:

1. **User Action** -> UI Interaction.
2. **Matrix 3 Generation** -> Intelligence layer produces artifact.
3. **ALGA Gate (MANDATORY)** -> Runtime governance validation.
4. **Local Persistence (SQLite WAL)** -> ALGA-passed records committed to local durable cache.
5. **Replication (PowerSync/Electric)** -> Sync Rules publish ALGA-governed state to Postgres.
6. **Federation** -> Other devices receive shapes and re-validate via local ALGA (Zero-Trust).

## Fallback Design
If the Sync Service (Postgres/Electric) is down:
- The node continues in **Sovereign Local Mode** (DashMap + SQLite).
- Sync is deferred, not lost.
- UI displays "Sync Deferred (Local Sovereignty Active)".

---
*Last Updated: 2026-05-08*
