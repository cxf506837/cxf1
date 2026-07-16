@echo off
setlocal

set "ROOT=%~dp0.."
set "LOG_DIR=%ROOT%\storage\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "PATH=C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;%PATH%"
set "NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000"

cd /d "%ROOT%\frontend"
"C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd" exec next start -H 127.0.0.1 -p 3000 > "%LOG_DIR%\frontend.out.log" 2> "%LOG_DIR%\frontend.err.log"
