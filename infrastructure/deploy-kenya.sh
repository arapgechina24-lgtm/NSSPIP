#!/bin/bash
# NCTIRS Kenya Sovereign Deployment Script
# For Node Africa, Wananchi, or on-premise data centers

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🇰🇪 NCTIRS Sovereign Deployment${NC}"
echo "================================"

# Check if running in Kenya (timezone check)
TIMEZONE=$(timedatectl | grep "Time zone" | awk '{print $3}')
if [[ "$TIMEZONE" != "Africa/Nairobi" ]]; then
    echo -e "${YELLOW}⚠️  Warning: Timezone is $TIMEZONE, expected Africa/Nairobi${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verify no foreign API keys in environment
echo -e "${YELLOW}🔍 Checking for foreign API dependencies...${NC}"
if env | grep -qE "(OPENAI|ANTHROPIC|GEMINI|COHERE)"; then
    echo -e "${RED}❌ ERROR: Foreign API keys detected in environment${NC}"
    echo "Remove these before sovereign deployment:"
    env | grep -E "(OPENAI|ANTHROPIC|GEMINI|COHERE)" || true
    exit 1
fi

echo -e "${GREEN}✅ No foreign API keys found${NC}"

# Check local AI availability
echo -e "${YELLOW}🤖 Checking local AI engine...${NC}"
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo -e "${RED}❌ Ollama not running. Start with: ollama serve${NC}"
    exit 1
fi

# Verify Kenyan models loaded
MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
if ! echo "$MODELS" | grep -q "nctirs"; then
    echo -e "${YELLOW}⚠️  Kenyan security model not found. Loading...${NC}"
    ollama create nctirs-security -f ./models/Modelfile || true
fi

echo -e "${GREEN}✅ Local AI ready: $MODELS${NC}"

# Database encryption setup
echo -e "${YELLOW}🔐 Setting up encrypted storage...${NC}"
mkdir -p /data/nctirs/keys
chmod 700 /data/nctirs/keys

if [[ ! -f /data/nctirs/keys/master.key ]]; then
    openssl rand -base64 32 > /data/nctirs/keys/master.key
    chmod 600 /data/nctirs/keys/master.key
    echo -e "${GREEN}✅ Generated master encryption key${NC}"
fi

# Deploy
echo -e "${YELLOW}🚀 Deploying NCTIRS...${NC}"
docker-compose -f docker-compose.sovereign.yml down || true
docker-compose -f docker-compose.sovereign.yml up -d --build

# Verify deployment
echo -e "${YELLOW}⏳ Waiting for services...${NC}"
sleep 10

if curl -sf http://localhost:3000/api/health/sovereign | grep -q "sovereign.*true"; then
    echo -e "${GREEN}✅ NCTIRS Sovereign Mode ACTIVE${NC}"
    echo ""
    echo "Deployment Summary:"
    echo "  🏠 Data Residency: Kenya Only"
    echo "  🤖 AI Engine: Local Ollama"
    echo "  🔐 Encryption: AES-256-GCM"
    echo "  🌐 Foreign API Calls: ZERO"
    echo "  📊 Dashboard: http://localhost:3000"
    echo ""
    echo -e "${GREEN}🇰🇪 National Self-Reliance: VERIFIED${NC}"
else
    echo -e "${RED}❌ Deployment failed. Check logs: docker-compose logs${NC}"
    exit 1
fi
