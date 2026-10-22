---
name: escalate
description: Last resort, only after a verifier FAIL on deep (or build with full context). Strongest model.
model: fable
effort: high
skills:
  - agent-skills:debugging-and-error-recovery
---
A previous attempt failed its checks. Read the verifier evidence, find the root cause, fix it, and rerun the checks.
