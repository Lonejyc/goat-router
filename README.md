# GOAT Router for Claude Code

Delegate coding tasks to subagents with the right **model + effort**, verify the result, escalate once on failure — and watch it live on a small dashboard.

Inspired by the GOAT router from @donimas' AI LEVELS series.

## How it works

| Agent | Model | Effort | Role |
|---|---|---|---|
| `triage` | sonnet | low | classifies the task → `quick` / `build` / `deep` + risk + checks |
| `quick` | sonnet | low | small, well-specified changes |
| `build` | opus | medium | normal features and fixes |
| `deep` | opus | xhigh | architecture, migrations, auth, payments, unclear work |
| `escalate` | fable | high | only after a failed check |
| `verifier` | sonnet | medium | runs checks, answers PASS / FAIL, never edits |

`/router on` starts the dashboard (http://localhost:4317) and tells the session to route through these agents. `/router off` stops both. Two hooks (`SubagentStart` / `SubagentStop`) log each run to `~/.claude/router-dashboard/events.jsonl`; the dashboard shows agent, model, effort, tokens, estimated cost and verdict.

## Install

```bash
git clone <this repo> goat-router && cd goat-router
./install.sh
```

Needs `node` and Claude Code. Restart Claude Code, then `/router on`. The installer backs up `settings.json` to `settings.json.bak`.

## Notes

- **Prices** in `dashboard/server.js` (`PRICE`) are placeholders in a ×1 / ×2 / ×5 ratio — set your real $/1M-token prices.
- Agent `skills:` reference plugin skills (`ponytail:ponytail`, `agent-skills:*`); edit `agents/*.md` to match what you have installed.
- Routing is an instruction to the main session, not enforced by the harness. Don't set `CLAUDE_CODE_EFFORT_LEVEL`: it overrides subagent effort.
- The "start in a visible shell" step uses iTerm via AppleScript (macOS), and falls back to a background process.
- Cost only counts subagent runs, not the main session.

## License

[MIT](LICENSE)
