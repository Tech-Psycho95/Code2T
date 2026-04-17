#!/bin/bash

# Voice-Native Developer Agent - HackBLR Quick Setup Script
# This script automates the initial setup process

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🎤 Voice-Native Developer Agent - Setup Script          ║"
echo "║     HackBLR 2026                                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ first."
    exit 1
fi

echo "✓ Node.js $(node --version) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✓ Dependencies installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env created - Edit it with your API keys"
else
    echo "ℹ️  .env already exists"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  📋 Next Steps:                                            ║"
echo "║                                                            ║"
echo "║  1. Edit .env with your API keys:                         ║"
echo "║     - VAPI_API_KEY (from https://dashboard.vapi.ai)      ║"
echo "║     - OPENAI_API_KEY (from https://platform.openai.com)  ║"
echo "║                                                            ║"
echo "║  2. Start Qdrant (vector database):                       ║"
echo "║     docker run -p 6333:6333 qdrant/qdrant:latest         ║"
echo "║     OR download from https://qdrant.tech/download/       ║"
echo "║                                                            ║"
echo "║  3. Seed the knowledge base:                              ║"
echo "║     npm run seed                                           ║"
echo "║                                                            ║"
echo "║  4. Start the backend:                                    ║"
echo "║     npm run dev                                            ║"
echo "║                                                            ║"
echo "║  5. Test the REST endpoint:                               ║"
echo "║     curl -X POST http://localhost:3000/api/query \\      ║"
echo "║       -H 'Content-Type: application/json' \\             ║"
echo "║       -d '{\"query\": \"How do I fix a null pointer?\"}'  ║"
echo "║                                                            ║"
echo "║  6. Demo scenarios in DEMO_SCENARIOS.md                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
