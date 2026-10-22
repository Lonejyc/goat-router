#!/usr/bin/env node
// Hook SubagentStart/SubagentStop: append the raw hook payload to events.jsonl.
const fs = require('fs'), path = require('path');
let raw = '';
process.stdin.on('data', d => (raw += d)).on('end', () => {
  try {
    fs.appendFileSync(path.join(__dirname, 'events.jsonl'), JSON.stringify({ t: Date.now(), ...JSON.parse(raw) }) + '\n');
  } catch {}
});
