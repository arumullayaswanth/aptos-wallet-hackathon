#!/bin/bash

# Research Data Timestamping DApp - Quick Setup Script
# This script helps new developers set up the project quickly

echo "🚀 Research Data Timestamping DApp - Quick Setup"
echo "================================================"

# Colors for output
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}📋 Checking prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js (v18+ recommended)${NC}"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ Python found: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.6+${NC}"
    echo "   Download from: https://python.org/"
    exit 1
fi

# Check Aptos CLI
if command_exists aptos; then
    APTOS_VERSION=$(aptos --version)
    echo -e "${GREEN}✅ Aptos CLI found: $APTOS_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Aptos CLI not found. Installing...${NC}"
    curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

    if command_exists aptos; then
        echo -e "${GREEN}✅ Aptos CLI installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Aptos CLI${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"

# Install npm dependencies
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install npm dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

echo ""
echo -e "${BLUE}⚙️  Setting up environment...${NC}"

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from template${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your account details${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Make deploy script executable
chmod +x deploy.sh
echo -e "${GREEN}✅ Made deploy script executable${NC}"

echo ""
echo -e "${BLUE}🔧 Setting up Aptos account...${NC}"

# Check if .aptos directory exists
if [ ! -d ".aptos" ]; then
    echo -e "${YELLOW}Setting up new Aptos account...${NC}"
    aptos init
    echo -e "${GREEN}✅ Aptos account initialized${NC}"
else
    echo -e "${GREEN}✅ Aptos account already configured${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Edit .env file with your Aptos account details"
echo "2. Run 'npm run move:compile' to compile the contract"
echo "3. Run 'npm run move:test' to run tests"
echo "4. Run './deploy.sh' to deploy to testnet"
echo "5. Run 'npm run dev' to start the frontend"
echo ""
echo -e "${BLUE}🔗 Useful Commands:${NC}"
echo "   npm run move:compile  - Compile Move contract"
echo "   npm run move:test     - Run Move tests"
echo "   npm run move:publish  - Deploy to testnet"
echo "   npm run dev          - Start development server"
echo "   npm run build        - Build for production"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "   README.md            - Complete project documentation"
echo "   .env.example         - Environment variables reference"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"