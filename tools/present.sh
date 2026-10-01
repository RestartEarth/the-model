#!/bin/sh
# Kiosk-style local present. Opens the keynote in conductor mode.
# Add ?audience=1 to hide presenter chrome on the projector window.
cd "$(dirname "$0")/../apps/keynote" || exit 1
npm run dev -- --host --open
