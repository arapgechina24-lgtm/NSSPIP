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

# Create directory structure
echo "📁 Creating directories..."
mkdir -p infrastructure
mkdir -p src/lib/benchmarks
mkdir -p src/lib/ai
mkdir -p src/lib/audit
mkdir -p src/lib/cross-sector
mkdir -p src/app/api/benchmarks
mkdir -p src/app/api/system/sovereignty-status
mkdir -p src/app/api/cross-sector/impact
mkdir -p src/components/xai

# Create files (you'll paste content from above)
echo "✅ Directory structure created"
echo ""
echo "Next steps:"
echo "1. Copy each file content from the guide above"
echo "2. Paste into the corresponding file"
echo "3. Run: git add . && git commit -m 'fix: all critical NIRU issues'"
echo "4. Deploy to Kenyan infrastructure (not Vercel)"
echo ""
echo "Critical files to create:"
echo "  - infrastructure/docker-compose.sovereign.yml"
echo "  - infrastructure/deploy-kenya.sh"
echo "  - src/lib/ai/sovereign-ai.ts"
echo "  - src/lib/benchmarks/security-metrics.ts"
echo "  - src/lib/ai/bias-mitigation.ts"
echo "  - src/components/xai/ExplanationPanel.tsx"
echo "  - src/lib/cross-sector/health-module.ts"
echo "  - src/lib/cross-sector/agriculture-module.ts"
echo "  - docs/DEPLOYMENT_ROADMAP.md"
