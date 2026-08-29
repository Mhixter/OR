#!/usr/bin/env bash
set -euo pipefail

export CI=1

if [[ -f package-lock.json ]]; then
  npm ci --ignore-scripts --no-audit --no-fund
else
  npm install --ignore-scripts --no-audit --no-fund
fi

npm test
npm run build