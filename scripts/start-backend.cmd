@echo off
setlocal

set "ROOT=%~dp0.."
set "LOG_DIR=%ROOT%\storage\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

cd /d "%ROOT%\backend"
if not exist ".venv\Scripts\python.exe" (
  echo Backend virtual environment is missing. Run: python -m venv .venv
  exit /b 1
)

".venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 > "%LOG_DIR%\backend.out.log" 2> "%LOG_DIR%\backend.err.log"

