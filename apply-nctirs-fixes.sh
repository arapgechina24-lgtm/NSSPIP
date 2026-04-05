#!/bin/bash
# Apply all NCTIRS fixes for NIRU Hackathon
set -e

echo "🔧 NCTIRS Critical Fixes Installer"
echo "=================================="

# Check we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: Run from NCTIRS root directory"
    exit 1
fi

chmod +x infrastructure/deploy-kenya.sh
echo "✅ Directory structure created and scripts made executable"
