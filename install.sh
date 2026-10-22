#!/usr/bin/env bash
# Installs GOAT router into ~/.claude (agents, /router command, dashboard, hooks). Safe to re-run.
set -e
S="$(cd "$(dirname "$0")" && pwd)"; C="$HOME/.claude"
mkdir -p "$C/agents" "$C/commands" "$C/router-dashboard"
cp "$S"/agents/*.md "$C/agents/"
cp "$S"/commands/router.md "$C/commands/"
cp "$S"/dashboard/* "$C/router-dashboard/"
chmod +x "$C/router-dashboard/router.sh"
[ -f "$C/settings.json" ] && cp "$C/settings.json" "$C/settings.json.bak"
node -e '
const fs=require("fs"),f=process.env.HOME+"/.claude/settings.json";
const s=fs.existsSync(f)?JSON.parse(fs.readFileSync(f,"utf8")):{};
const cmd="node "+process.env.HOME+"/.claude/router-dashboard/hook.js";
s.hooks=s.hooks||{};
for(const e of ["SubagentStart","SubagentStop"]){
  s.hooks[e]=s.hooks[e]||[];
  if(!JSON.stringify(s.hooks[e]).includes("router-dashboard/hook.js")) s.hooks[e].push({hooks:[{type:"command",command:cmd}]});
}
fs.writeFileSync(f,JSON.stringify(s,null,2)+"\n");'
echo "Done. Restart Claude Code, then run /router on"
