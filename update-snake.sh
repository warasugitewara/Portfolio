#!/bin/bash
# Fetch latest snake SVGs from GitHub
cd /opt/portfolio
git fetch origin main 2>/dev/null
git checkout origin/main -- public/github-contribution-grid-snake-dark.svg public/github-contribution-grid-snake.svg 2>/dev/null
