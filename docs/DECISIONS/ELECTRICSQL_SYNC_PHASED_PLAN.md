# ElectricSQL Sync Integration: Phased Implementation Plan (v1.2)

**Project:** ZQ_COORDINATOR  
**Goal:** Durable, local-first, multi-device AI workspace  
**Status:** Experimental / Post-v0.2.0  
**Branch:** `feat/electricsql-sync`

## Non-Negotiable Rules
1. **ALGA-First Governance**: No data persists or syncs without passing ALGA (`>= 85` composite, `>= 90` governance).
2. **Local-First sacredness**: Core operations must never block on network.
3. **Additive Integration**: Do not break DashMap/ChannelStore v0.2.0 hot paths.

---

## Phase 1: Foundation (Current)
- Docker-based Postgres + ElectricSQL stack (Development).
- **WAL Bridge**: DashMap → atomic SQLite writes with `PRAGMA journal_mode=WAL`.
- **ALGA Service**: Async background worker for governance gates.
- **Quarantine Store**: Implementation of isolated storage for failed validations.

## Phase 2: Core Entity Synchronization
- Selective Replication via **ElectricSQL Shapes**.
- Sync Targets: `channels`, `conversations`, `messages`, `memory_bank_snapshots`.
- Cross-device Conflict Resolution using **Vector Clocks** + ALGA re-validation.

## Phase 3: Mobile & Advanced Features
- Android foreground-only sync (Phase 3.1) → Background metadata sync (Phase 3.2).
- Battery/Network-aware adaptive synchronization.
- **Air-Gap Mode**: Support for `.zqsync` encrypted export/import bundles.

## Phase 4: Release Readiness
- Full observability dashboard (Sync latency, ALGA throughput).
- Operational runbooks for Postgres/Electric recovery.
- Promotion to v0.3.x development line.

---
*Reference: zq-coordinator-discusion-gpt01.txt*
