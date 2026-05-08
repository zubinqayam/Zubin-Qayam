# ZQ_COORDINATOR Copilot Instructions

Follow this execution order exactly:
1. Branch stabilization
2. PR stabilization
3. CI/CD hardening
4. Deployment readiness
5. UI architecture refactor
6. ChatGPT-style conversational runtime
7. ALGA governance integration
8. Release preparation

Hard rules:
- Never propose unsafe mega-PRs.
- Never merge risky dependency upgrades without validation.
- Treat deployment, signing, secret handling, sync truthfulness, and governance failures as blockers.
- For architectural changes, update the relevant decision doc in docs/DECISIONS/.
- Prefer small, scoped changes with explicit validation steps.
- Frontend must evolve toward Sidebar + Main Chat Area + AI Ops Panel.
- Backend changes must preserve typed errors, concurrency safety, and secure provider proxying.
- Android release work must fail if debug signing is used in release config.
