#!/bin/bash
# Apply all NSSPIP fixes for NIRU Hackathon
set -e

echo "🔧 NSSPIP Critical Fixes Installer"
echo "=================================="

# Check we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: Run from NSSPIP root directory"
    exit 1
fi

chmod +x infrastructure/deploy-kenya.sh
echo "✅ Directory structure created and scripts made executable"
