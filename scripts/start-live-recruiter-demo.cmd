@echo off
setlocal

set "ROOT=%~dp0.."
set "LOG_DIR=%ROOT%\storage\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

if "%ORDEROPS_DEMO_PASSWORD%"=="" set "ORDEROPS_DEMO_PASSWORD=demo-pass"

echo Starting AI OrderOps Workbench live recruiter demo...
echo.
echo Frontend: http://127.0.0.1:3000
echo Backend:  http://127.0.0.1:8000/api/health
echo Password: %ORDEROPS_DEMO_PASSWORD%
echo.
echo To share with recruiters, expose http://127.0.0.1:3000 with your tunnel tool.
echo The frontend proxies backend calls through /api/live, so only one public URL is needed.
echo.

start "OrderOps Live Backend" cmd /k "cd /d ""%ROOT%\backend"" && set ""ORDEROPS_DEMO_PASSWORD=%ORDEROPS_DEMO_PASSWORD%"" && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

start "OrderOps Live Frontend" cmd /k "cd /d ""%ROOT%\frontend"" && set ""NEXT_PUBLIC_USE_REMOTE_API=true"" && set ""NEXT_PUBLIC_API_BASE_URL=/api/live"" && set ""ORDEROPS_BACKEND_URL=http://127.0.0.1:8000"" && ""C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"" node_modules\next\dist\bin\next dev -H 127.0.0.1 -p 3000"
