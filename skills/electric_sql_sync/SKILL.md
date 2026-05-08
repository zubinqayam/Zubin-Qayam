---
name: ElectricSQL Sync Integration for ZQCOORDINATOR
description: >
  Design and implement a post-v0.2.0 ElectricSQL-based sync layer for
  ZQCOORDINATOR, evolving from single-node ChannelStore to a durable,
  local-first, multi-device AI workspace while preserving release stability.
author: Zubin Qayam
version: 1.0.0
category: Distributed Systems
tags:
  - electricsql
  - sync
  - local-first
  - postgres
  - sqlite
  - tauri
  - ai-workspace
  - architecture
---

# ElectricSQL Sync Integration Skill for ZQCOORDINATOR

## Role

You operate as:

- Distributed Systems Architect  
- Local-First Sync Engineer  
- AI Workspace Infrastructure Lead  

for the repository `zubinqayam/ZQCOORDINATOR`.[file:3]

Your mission is to evolve the system from a **single-node, local-only ChannelStore** into a **durable, local-first, multi-device AI workspace** using **ElectricSQL + PostgreSQL + SQLite**, without destabilizing the v0.2.0 release.[file:3]

---

## Non-Negotiable Release Rule

**ElectricSQL integration is strictly post‑v0.2.0 and experimental.**[file:3]

The skill must:

- NOT destabilize `release/v0.2.0`.  
- NOT introduce ElectricSQL into release‑critical paths.  
- NOT remove or break the current DashMap / ChannelStore local-only fallback.  

All ElectricSQL work must happen only in a dedicated branch:

- `feat/electricsql-sync`.[file:3]

---

## Primary Objectives

1. **Add Durable Sync Layer**[file:3]  
   - Implement PostgreSQL‑backed synchronization.  
   - Use local SQLite for per-device persistence.  
   - Enable partial replication (by user, channel, session).  
   - Synchronize conversations, messages, MemoryBank snapshots, and key operational records.

2. **Preserve Local-First UX**[file:3]  
   - App must stay responsive and fully usable offline.  
   - Core operations (chat, channels, memory) must not block on network.  
   - Sync should resume opportunistically when connectivity returns.

3. **Retain Existing Hot-Path Memory**[file:3]  
   - Keep DashMap-based `ChannelStore` for live in-memory operations.  
   - Use ElectricSQL for durability, replication, and cross-device continuity.  
   - Avoid routing the UI directly to remote state.

---

## Target Architecture

Required flow:[file:3]

- UI Conversation Layer  
- → ChannelStore (DashMap, in-memory)  
- → SQLite Local Store  
- → ElectricSQL Sync  
- → PostgreSQL (durable truth layer)

**Hybrid Sync Model**[file:3]:

- DashMap: low-latency in-memory hot path.  
- SQLite: local persistent cache.  
- ElectricSQL: selective replication to/from Postgres.

Do NOT:

- Fully centralize live runtime state in Postgres.  
- Make UI depend on ElectricSQL availability.  
- Remove the local-only operational mode.

---

## ElectricSQL Usage Rules

All synchronization must use **ElectricSQL Shapes**.[file:3]

Example shape patterns:

- `WHERE user_id = ?`  
- `WHERE channel_id IN (...)`  
- `WHERE session_id = ?`  

Goals:

- Minimize sync payloads.  
- Reduce Android bandwidth.  
- Isolate AI contexts (per user / per workspace).  
- Improve scalability for multi-device and multi-agent use.

### Initial Sync Targets (Tables)

At minimum, design schema and shapes for:[file:3]

- `channels`  
- `conversations`  
- `messages`  
- `memory_bank` or `memory_snapshots`  
- `session_snapshots`  
- `github_injections` / operational events  

---

## Phased Implementation Plan

### Phase 1 – Experimental Foundation

Branch: `feat/electricsql-sync`.[file:3]

- Add PostgreSQL + ElectricSQL service configuration (no production wiring yet).  
- Define local SQLite schema aligned with ElectricSQL Shapes.  
- Implement one **test shape** and one **synchronized conversation** path.  
- Keep production release paths untouched.  
- Do **not** remove existing sync logic; only add experimental wiring behind flags.

### Phase 2 – Channel Synchronization

- Add channel-level replication and MemoryBank snapshots sync.[file:3]  
- Support session persistence and replay.  
- Validate:
  - Offline recovery.  
  - Reconnect consistency.  
  - Partial replication correctness (per user/channel).

### Phase 3 – AI Workspace Sync

- Sync AI session continuity, deployment history, GitHub injection records, and key operational logs.[file:3]  
- Ensure long-running AI work (projects, audits, deployments) can be resumed across devices.

### Phase 4 – Multi-Device Coordination

- Validate desktop↔desktop↔Android flows.[file:3]  
- Test:
  - Offline mutations and later reconciliation.  
  - Conflict handling behavior.  
  - Ordering guarantees for messages and operations.  
  - Background resume and sync after mobile reconnect.

---

## Rust Backend Requirements

In `src-tauri` the backend must:[file:3]

- Manage SQLite lifecycle and schema migrations.  
- Orchestrate sync between DashMap, SQLite, and ElectricSQL.  
- Provide an explicit **fallback mode** when ElectricSQL / Postgres is unavailable.  
- Handle auth tokens and connection configuration.  
- Expose sync health and status to the frontend (for UI indicators).

Backend rules:

- Keep ChannelStore API stable for the v0.2.x line.  
- Add ElectricSQL integration as additive, behind explicit feature flags.  
- Avoid deep coupling to immature Rust ElectricSQL clients; keep orchestration logic mostly in TS/JS if needed.[file:3]

---

## Frontend Requirements

Stack assumptions: React + TanStack Query/DB + ElectricSQL React hooks (or equivalent).[file:3]

Frontend must support:

- Live, reactive conversation views backed by local SQLite + ElectricSQL.  
- Clear sync status indicators per workspace/channel (e.g., “Synced”, “Pending 4”, “Offline”).  
- Offline indicators and graceful reconnect recovery.  
- No blocking on remote state for composing/sending messages in normal operation.

UI behaviors:

- If ElectricSQL/Postgres is down, keep using local DashMap + SQLite.  
- When sync returns, reconcile and push/pull deltas without interrupting the user.  

---

## Fallback and Failure Modes

The system **must** support reliable local-only mode.[file:3]

If any of these fail:

- Postgres  
- ElectricSQL service  
- Network  
- Auth

Then:

- Local SQLite + ChannelStore continue to function.  
- Sync is deferred, not blocked.  
- UI surfaces clear, honest status (e.g., “Sync deferred, local only”).  

Never:

- Block core chat / workspace operations on network.  
- Fake sync or health states.

---

## SyncDecision Documentation

Update `SYNCDECISION.md` as follows:[file:3]

- Option A – Original CRDT-style design (historical).  
- Option B – Current simplified local-only sync (v0.2.0).[file:3]  
- **Option C – ElectricSQL-backed selective replication (this work).**[file:3]

For Option C, document:

- Why Option B existed (stabilization).  
- Why ElectricSQL is being introduced.  
- Migration path from B → C.  
- Rollback strategy if ElectricSQL needs to be disabled.  
- Known limitations and non-goals for initial phases.

---

## Security Requirements

Never:[file:3]

- Expose database credentials in the frontend.  
- Embed Postgres/ElectricSQL secrets directly into Tauri bundles.  
- Allow unrestricted Shapes across all tenants/users.  

Must:

- Use scoped auth per user/workspace.  
- Encrypt transport.  
- Log sync operations for audit (without leaking sensitive payloads).  
- Ensure ElectricSQL access obeys least-privilege principles.

---

## Performance Requirements

Target behavior:[file:3]

- Efficient on Android and lower-resource devices.  
- Partial replication only (only what the user needs).  
- Fast reconnect and incremental updates.  
- Low memory footprint in desktop and mobile.

Avoid:

- Blind full-history sync for all conversations.  
- Oversized Shapes that fetch everything.  
- Long-blocking sync operations in the UI thread.

---

## Testing Requirements

Required scenarios:[file:3]

1. **Connectivity**
   - Offline startup with no network.  
   - Online startup with sync.  
   - Network loss mid-session.  
   - Reconnect and sync recovery.

2. **Data Integrity**
   - Message replay and consistency across devices.  
   - MemoryBank persistence and snapshot correctness.  
   - Duplicate-prevention for messages/events.

3. **Multi-Device**
   - Concurrent updates from two desktops.  
   - Desktop + Android conflict and resolution.  
   - Ordering guarantees for critical operations.

4. **Mobile Persistence**
   - Backgrounding the app on Android.  
   - Resuming and syncing after wake.  
   - Handling intermittent mobile connectivity.

---

## Release Governance

ElectricSQL integration remains **experimental** until:[file:3]

- Durability and replay are validated in real flows.  
- Offline recovery is proven in tests.  
- CI adds coverage for sync operations.  
- Operational complexity is documented and accepted.

Do NOT:

- Merge ElectricSQL changes into `release/v0.2.0`.  
- Replace ChannelStore or local-only fallback in the stabilization cycle.  

Future promotion to a v0.3.x line requires:

- Passing full test matrix.  
- Clear documentation of new infra dependencies (Postgres, ElectricSQL).  
- Updated operational playbooks and incident handling.

---

## Core Architectural Principle

ZQCOORDINATOR is evolving into an **AI-native, local-first operational workspace**, not a traditional cloud-only desktop app.[file:3]

All sync decisions must support:

- Durable AI conversations.  
- Operational memory over time.  
- Multi-device continuity.  
- Local-first responsiveness.  
- Future streaming and multi-agent orchestration.

Final objective:

> Build a scalable, local-first, multi-device, operationally durable sync architecture for ZQCOORDINATOR using ElectricSQL, without compromising the stability of the v0.2.0 line.[file:3]
