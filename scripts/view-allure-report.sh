#!/bin/bash

# =============================================================================
# View Allure Report Locally
# =============================================================================
# This script downloads the latest Allure artifacts from GitHub and opens
# the report in your browser.
#
# USAGE:
#   ./scripts/view-allure-report.sh
# =============================================================================

set -e

echo "📥 Downloading Allure results from GitHub..."

# Download the latest smoke-dev-allure-results artifact
echo "Downloading smoke-dev-allure-results..."
gh run download \
  --name smoke-dev-allure-results \
  --dir allure-results-temp \
  --pattern "*-allure-results" || echo "⚠️  GitHub CLI not found or no artifacts available"

# Check if we got any results
if [ ! -d "allure-results-temp" ] || [ -z "$(ls -A allure-results-temp 2>/dev/null)" ]; then
  echo "❌ No Allure results found. Have tests run recently?"
  echo ""
  echo "To trigger tests:"
  echo "  1. Go to: https://github.com/Maciel98/Automation-Challenge-PW/actions"
  echo "  2. Click 'E2E Test Pipeline'"
  echo "  3. Click 'Run workflow'"
  exit 1
fi

# Move results to expected location
rm -rf allure-results
mv allure-results-temp allure-results

echo "✅ Allure results downloaded"

# Check if Allure CLI is installed
if ! command -v allure &> /dev/null; then
  echo "📦 Installing Allure CLI..."
  npm install -g allure-commandline
fi

echo "📊 Generating Allure report..."
allure generate allure-results --clean -o allure-report

echo "🌐 Opening Allure report in browser..."
allure open allure-report

echo ""
echo "✅ Done! Your Allure report is now open in your browser."
echo ""
echo "To view it again later:"
echo "  allure open allure-report"
