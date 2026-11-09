#!/usr/bin/env bash
# Auto-update the site on the server.
#
# Checks GitHub for new commits on the current branch. If there are any, it
# pulls them, rebuilds the containers, and checks the site is healthy. If
# nothing changed, it exits without doing anything.
#
# Run it by hand:     scripts/auto-update.sh
# Run it on a timer:  scripts/install-auto-update.sh   (adds a cron job)

set -euo pipefail

# cron runs with a minimal PATH; make sure git, docker and curl are found.
export PATH="$PATH:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HEALTH_URL="${HEALTH_URL:-http://localhost:8080/healthz}"

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*"; }

cd "$PROJECT_DIR"

# Only one update at a time, even if a rebuild takes longer than the timer.
if command -v flock >/dev/null 2>&1; then
  exec 9>"/tmp/cloudapp-auto-update.lock"
  if ! flock -n 9; then
    log "Another update is still running, skipping."
    exit 0
  fi
fi

if [ ! -f .env ]; then
  log "ERROR: $PROJECT_DIR/.env is missing. Create it from .env.example first."
  exit 1
fi

git fetch --quiet origin

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse '@{u}')"

if [ "$LOCAL" = "$REMOTE" ]; then
  exit 0 # nothing new, stay quiet
fi

log "New commits found: ${LOCAL:0:7} -> ${REMOTE:0:7}"
git log --oneline "$LOCAL..$REMOTE" | sed 's/^/    /'

# --ff-only refuses to merge, so local edits on the server are never
# silently mixed with GitHub's version. Fix by hand if this fails.
if ! git pull --ff-only --quiet; then
  log "ERROR: git pull failed (local changes on the server?). Run 'git status' in $PROJECT_DIR."
  exit 1
fi

log "Rebuilding containers..."
docker compose up -d --build --remove-orphans 2>&1 | sed 's/^/    /'

# Give nginx a few seconds, then make sure the site answers.
healthy=no
for _ in 1 2 3 4 5 6; do
  sleep 5
  if curl -fsS -o /dev/null "$HEALTH_URL"; then
    healthy=yes
    break
  fi
done

if [ "$healthy" = yes ]; then
  log "Update complete, site is healthy at ${REMOTE:0:7}."
else
  log "WARNING: update finished but $HEALTH_URL is not responding. Check 'docker compose ps'."
fi

# Old images pile up after each rebuild; remove the unused ones.
docker image prune -f >/dev/null
