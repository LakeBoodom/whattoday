#!/bin/bash
set -e

echo "🚀 WhatToday — Deploy to Vercel"
echo "================================"

# Install Vercel CLI globally if not present
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Git setup
echo "📝 Setting up git..."
git config --global init.defaultBranch main
git init 2>/dev/null || true
git branch -M main 2>/dev/null || true
git add -A
git commit -m "Initial commit — WhatToday" 2>/dev/null || echo "Nothing to commit"

# Check for GitHub CLI
if command -v gh &> /dev/null; then
  echo "📤 Creating GitHub repo and pushing..."
  gh repo create whattoday --public --source=. --push
else
  echo ""
  echo "⚠️  GitHub CLI not found. Two options:"
  echo ""
  echo "Option A — Quick (no GitHub, direct Vercel deploy):"
  echo "  vercel deploy --prod"
  echo ""
  echo "Option B — With GitHub (recommended for CI/CD):"
  echo "  1. Create repo: https://github.com/new (name it 'whattoday')"
  echo "  2. git remote add origin https://github.com/YOUR_USERNAME/whattoday.git"
  echo "  3. git push -u origin main"
  echo "  4. Then import at: https://vercel.com/new"
  echo ""
fi

# Deploy to Vercel
echo ""
echo "🎯 Deploying to Vercel..."
echo "(This will open a browser for auth if not already logged in)"
echo ""
vercel deploy --prod

echo ""
echo "✅ Done! Your site is live."
echo "Don't forget to:"
echo "  1. Add custom domain: whattoday.org in Vercel dashboard"
echo "  2. Add Google AdSense script to app/layout.tsx"
