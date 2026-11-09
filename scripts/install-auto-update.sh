#!/usr/bin/env bash
# Install (or remove) a cron job that runs auto-update.sh every 5 minutes.
#
#   scripts/install-auto-update.sh              install / reinstall
#   scripts/install-auto-update.sh --uninstall  remove
#
# Output goes to ~/cloudapp-auto-update.log

set -euo pipefail

SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/auto-update.sh"
LOG="$HOME/cloudapp-auto-update.log"
MARKER="# cloudapp-auto-update"
SCHEDULE="${SCHEDULE:-*/5 * * * *}"

# Current crontab without our line (crontab -l fails if there is none yet).
existing="$(crontab -l 2>/dev/null | grep -v "$MARKER" || true)"

if [ "${1:-}" = "--uninstall" ]; then
  printf '%s\n' "$existing" | sed '/^$/d' | crontab -
  echo "Auto-update removed."
  exit 0
fi

chmod +x "$SCRIPT"
{
  printf '%s\n' "$existing" | sed '/^$/d'
  echo "$SCHEDULE $SCRIPT >> $LOG 2>&1 $MARKER"
} | crontab -

echo "Auto-update installed: runs every 5 minutes."
echo "  Script: $SCRIPT"
echo "  Log:    $LOG"
echo "Watch it with:  tail -f $LOG"
