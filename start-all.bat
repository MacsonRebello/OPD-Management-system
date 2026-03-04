@echo off
REM Smart OPD Queue System - Start All Services (Windows)
REM This batch script starts backend, AI model, and frontend

echo ==================================
echo Starting Smart OPD Queue System
echo ==================================
echo.

REM Start Backend
echo Starting Backend Server...
start "OPD Backend" cmd /k "cd backend && npm install && npm start"
timeout /t 3

REM Start AI Model
echo Starting AI Model Server...
start "OPD AI Model" cmd /k "cd ai-model && python -m venv venv && venv\Scripts\activate.bat && pip install -r requirements.txt && python app.py"
timeout /t 3

REM Start Frontend
echo Starting Frontend Server...
start "OPD Frontend" cmd /k "cd frontend && npm install && npm run dev"
timeout /t 3

echo.
echo ==================================
echo All services started successfully!
echo ==================================
echo.
echo ✓ Frontend: http://localhost:3000
echo ✓ Backend API: http://localhost:5000/api
echo ✓ AI Model: http://localhost:5001/api
echo.
echo You can now access the application!
echo Close any terminal window to stop that service.
echo.
pause
