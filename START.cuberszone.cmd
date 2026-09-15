@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
	echo Installing dependencies...
	call npm install
	if errorlevel 1 (
		echo Dependency installation failed.
		pause
		exit /b 1
	)
)

powershell -NoProfile -Command "Start-Process 'http://localhost:5173'"
call npm run dev