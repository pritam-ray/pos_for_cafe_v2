#!/bin/bash

# C Square Restaurant Management System - GitHub Upload Script
# This script helps you initialize and upload your project to GitHub

echo "🚀 C Square Restaurant Management System - GitHub Upload"
echo "=================================================="

# Check if Git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git is installed"

# Initialize Git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📁 Adding all files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: C Square Restaurant Management System

- Complete restaurant management system with React + TypeScript
- Multi-role authentication (Owner, Employee, Viewer)
- Real-time order tracking and management
- Comprehensive analytics dashboard
- Inventory management system
- Mobile-responsive design
- Supabase backend integration"

# Add remote origin
echo "🌐 Adding GitHub remote..."
git remote add origin https://github.com/pritam-ray/pos_for_cafe_v2.git

# Check if main branch exists, if not create it
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git branch -M main
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 Successfully uploaded to GitHub!"
echo "📍 Repository URL: https://github.com/pritam-ray/pos_for_cafe_v2"
echo ""
echo "🔐 Next Steps:"
echo "1. Your .env file with sensitive data is safely ignored"
echo "2. Others can use .env.example to set up their own environment"
echo "3. Consider setting up GitHub Secrets for CI/CD deployment"
echo ""
echo "📚 Documentation:"
echo "- README.md: Project overview and quick start"
echo "- SETUP.md: Detailed setup instructions"
echo "- DEPLOYMENT.md: Production deployment guide"
echo "- SECURITY.md: Security best practices"
