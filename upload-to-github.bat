@echo off
echo 🚀 C Square Restaurant Management System - GitHub Upload
echo ==================================================

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

echo ✅ Git is installed

REM Initialize Git repository if not already initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
) else (
    echo ✅ Git repository already initialized
)

REM Add all files
echo 📁 Adding all files...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: C Square Restaurant Management System" -m "" -m "- Complete restaurant management system with React + TypeScript" -m "- Multi-role authentication (Owner, Employee, Viewer)" -m "- Real-time order tracking and management" -m "- Comprehensive analytics dashboard" -m "- Inventory management system" -m "- Mobile-responsive design" -m "- Supabase backend integration"

REM Add remote origin
echo 🌐 Adding GitHub remote...
git remote add origin https://github.com/pritam-ray/pos_for_cafe_v2.git

REM Switch to main branch
echo 🔄 Switching to main branch...
git branch -M main

REM Push to GitHub
echo ⬆️  Pushing to GitHub...
git push -u origin main

echo.
echo 🎉 Successfully uploaded to GitHub!
echo 📍 Repository URL: https://github.com/pritam-ray/pos_for_cafe_v2
echo.
echo 🔐 Next Steps:
echo 1. Your .env file with sensitive data is safely ignored
echo 2. Others can use .env.example to set up their own environment
echo 3. Consider setting up GitHub Secrets for CI/CD deployment
echo.
echo 📚 Documentation:
echo - README.md: Project overview and quick start
echo - SETUP.md: Detailed setup instructions
echo - DEPLOYMENT.md: Production deployment guide
echo - SECURITY.md: Security best practices
echo.
pause
