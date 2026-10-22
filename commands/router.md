---
description: Active/désactive la délégation aux sous-agents (triage → quick/build/deep → verifier) et le dashboard
argument-hint: on | off | status
allowed-tools: Bash(bash ~/.claude/router-dashboard/router.sh:*), Bash(open http://localhost:4317)
---
Run `bash ~/.claude/router-dashboard/router.sh $ARGUMENTS` (use `status` if no argument) and report its output in one line.

If the argument is `on`: also run `open http://localhost:4317`, then for the REST OF THIS SESSION follow these rules for real coding tasks (skip questions, explanations, trivial one-liners):
1. Call the triage agent first.
2. Delegate to the agent matching its route: quick, build or deep. Pass the full task and the triage JSON. Never pass a model parameter.
3. Then call the verifier with the risk and checks from triage.
4. If the verifier says FAIL, retry once, one step up:
   - it skipped a file or didn't run the tests → more effort (quick → build)
   - it had full context and was still wrong → bigger model (build → deep → escalate)
5. After any escalation, ask triage to save one line to its memory: "<task pattern> → <route that worked>".

If the argument is `off`: stop delegating, work directly again as usual.
