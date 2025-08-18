#!/bin/bash

# Research Data Timestamping DApp - Deployment Script
# This script compiles and deploys the Move contract to Aptos testnet

echo "🚀 Starting deployment process..."

# Colors for output
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m' # No Color

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo -e "${RED}❌ Aptos CLI not found. Please install it first.${NC}"
    echo "Run: curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "1. ✅ Aptos CLI installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ Please edit .env file with your account details and run again.${NC}"
    exit 1
fi

echo "2. ✅ Environment file found"

# Load environment variables
source .env

# Validate required variables
if [ -z "$MODULE_PUBLISHER_ACCOUNT_ADDRESS" ] || [ "$MODULE_PUBLISHER_ACCOUNT_ADDRESS" = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12" ]; then
    echo -e "${RED}❌ MODULE_PUBLISHER_ACCOUNT_ADDRESS not set in .env${NC}"
    exit 1
fi

echo "3. ✅ Environment variables configured"

# Step 1: Compile the Move contract
echo -e "${BLUE}🔨 Step 1: Compiling Move contract...${NC}"
aptos move compile --named-addresses MyModule=$MODULE_PUBLISHER_ACCOUNT_ADDRESS

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Compilation failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Contract compiled successfully${NC}"

# Step 2: Run tests
echo -e "${BLUE}🧪 Step 2: Running Move tests...${NC}"
aptos move test --named-addresses MyModule=$MODULE_PUBLISHER_ACCOUNT_ADDRESS

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Tests failed, but continuing with deployment...${NC}"
else
    echo -e "${GREEN}✅ All tests passed${NC}"
fi

# Step 3: Deploy to testnet
echo -e "${BLUE}🌐 Step 3: Deploying to Aptos testnet...${NC}"
echo -e "${YELLOW}This will publish the contract to address: $MODULE_PUBLISHER_ACCOUNT_ADDRESS${NC}"

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

aptos move publish --named-addresses MyModule=$MODULE_PUBLISHER_ACCOUNT_ADDRESS --assume-yes

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Contract deployed successfully!${NC}"
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "   Network: testnet"
echo "   Contract Address: $MODULE_PUBLISHER_ACCOUNT_ADDRESS"
echo "   Module Name: MyModule::ResearchTimestamp"
echo ""
echo -e "${GREEN}🔗 Next Steps:${NC}"
echo "1. Update frontend configuration with deployed contract address"
echo "2. Test the application with the deployed contract"
echo "3. Share the contract address with users for verification"
echo ""
echo -e "${BLUE}🌐 Testnet Explorer:${NC}"
echo "   View your contract: https://explorer.aptoslabs.com/account/$MODULE_PUBLISHER_ACCOUNT_ADDRESS/modules?network=testnet"
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"