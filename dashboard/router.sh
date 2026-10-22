#!/usr/bin/env bash
# router.sh on|off|status — start/stop the dashboard server (port 4317).
D="$HOME/.claude/router-dashboard"
up() { lsof -ti :4317 >/dev/null 2>&1; }
case "$1" in
  on)
    if ! up; then
      # visible shell in iTerm if possible, else background process
      osascript -e "tell application \"iTerm\"
        create window with default profile command \"/bin/zsh -lc 'exec node $D/server.js'\"
      end tell" >/dev/null 2>&1 || nohup node "$D/server.js" >/dev/null 2>&1 &
      sleep 1
    fi
    up && echo "router ON → http://localhost:4317" || echo "server failed to start" ;;
  off)
    up && kill $(lsof -ti :4317); echo "router OFF" ;;
  *) up && echo "router ON → http://localhost:4317" || echo "router OFF" ;;
esac
