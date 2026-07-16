@echo off
setlocal

start "OrderOps Backend" "%~dp0start-backend.cmd"
start "OrderOps Frontend" "%~dp0start-frontend.cmd"

echo Backend:  http://127.0.0.1:8000/api/health
echo Frontend: http://127.0.0.1:3000

