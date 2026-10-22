#!/usr/bin/env node
// Dashboard: node server.js → http://localhost:4317
const fs = require('fs'), path = require('path'), os = require('os'), http = require('http');
const DIR = __dirname, AGENTS = path.join(os.homedir(), '.claude', 'agents');
// $ per 1M tokens (in / out). ponytail: placeholder prices in the ×1 / ×2 / ×5 ratio of the Reel — put your real ones here.
const PRICE = { sonnet: [3, 15], opus: [6, 30], fable: [15, 75], haiku: [1, 5] };

const meta = type => { // model + effort come from the agent's frontmatter
  try {
    const f = fs.readFileSync(path.join(AGENTS, type + '.md'), 'utf8');
    return { model: (f.match(/^model:\s*(\S+)/m) || [])[1], effort: (f.match(/^effort:\s*(\S+)/m) || [])[1] };
  } catch { return {}; }
};

const usage = file => { // sum token usage from the subagent transcript
  const u = { in: 0, out: 0 };
  try {
    for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
      const x = l && JSON.parse(l).message?.usage;
      if (x) { u.in += (x.input_tokens || 0) + (x.cache_creation_input_tokens || 0) + (x.cache_read_input_tokens || 0) * 0.1; u.out += x.output_tokens || 0; }
    }
  } catch {}
  return u;
};

const runs = () => {
  const by = new Map();
  let lines = [];
  try { lines = fs.readFileSync(path.join(DIR, 'events.jsonl'), 'utf8').split('\n').filter(Boolean); } catch {}
  for (const l of lines) {
    const e = JSON.parse(l), id = e.agent_id || e.t;
    const r = by.get(id) || { id, session: e.session_id, agent: e.agent_type, start: e.t, ...meta(e.agent_type) };
    if (e.hook_event_name === 'SubagentStop') {
      r.end = e.t;
      const u = usage(e.agent_transcript_path), p = PRICE[r.model] || [0, 0];
      r.tokens = Math.round(u.in + u.out);
      r.cost = (u.in * p[0] + u.out * p[1]) / 1e6;
      const m = /\b(PASS|FAIL)\b/.exec(e.last_assistant_message || '');
      if (m) r.verdict = m[1];
    }
    by.set(id, r);
  }
  return [...by.values()].slice(-200);
};

http.createServer((req, res) => {
  if (req.url === '/runs') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(runs())); }
  res.setHeader('content-type', 'text/html'); res.end(fs.readFileSync(path.join(DIR, 'index.html')));
}).listen(4317, '127.0.0.1', () => console.log('http://localhost:4317'));
