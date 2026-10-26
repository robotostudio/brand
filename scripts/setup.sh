#!/usr/bin/env bash
# Install the tooling for every system that ships a kit (systems/*/kit/package.json).
# Safe to run repeatedly. Used by .cursor/environment.json and by people setting up a new machine.
set -euo pipefail
cd "$(dirname "$0")/.."

needs_browser=0
for kit in systems/*/kit; do
  [ -f "$kit/package.json" ] || continue
  echo "→ $kit"
  if [ -f "$kit/package-lock.json" ]; then npm ci --prefix "$kit" --no-audit --no-fund; else npm install --prefix "$kit" --no-audit --no-fund; fi
  grep -q '"playwright"' "$kit/package.json" && needs_browser=1 && browser_kit="$kit"
done

if [ "$needs_browser" = 1 ]; then
  # Linux cloud machines also need Chromium's system libraries.
  if [ "$(uname)" = "Linux" ]; then deps="--with-deps"; else deps=""; fi
  npx --prefix "$browser_kit" playwright install $deps chromium
fi
echo "Setup done."
