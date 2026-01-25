@echo off
echo ==========================================
echo  RETAIN DENTAL - AUTO DEPLOYMENT
echo ==========================================

REM 1. Check for Git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not found in your PATH.
    echo Please install Git for Windows: https://git-scm.com/download/win
    pause
    exit /b
)

REM 2. Initialize Git if needed
if not exist .git (
    echo [INFO] Initializing new Git repository...
    git init
) else (
    echo [INFO] Git repository found.
)

REM 3. Configure User (Local Scope)
git config user.name "Retain AI Agent"
git config user.email "agent@retain.dental"

REM 4. Add Changes
echo [INFO] Staging files...
git add .

REM 5. Commit
echo [INFO] Committing changes...
git commit -m "feat: Global User Management (Hard Delete & Registry)"

REM 6. Setup Remote (with PAT)
echo [INFO] Configuring remote...
git remote remove origin 2>nul
git remote add origin https://github.com/issacops/retain-dental.git

REM 7. Push
echo [INFO] Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. 
    echo If the error is "non-fast-forward", the remote has changes you don't have.
    echo functionality is safe locally.
) else (
    echo.
    echo [SUCCESS] Deployed successfully to https://github.com/issacops/retain-dental
)

pause
