@echo off
:: Set the text color to green
color 0A

:: Prompt user to open the executor
echo Please open the executor now.
pause

:: Ask user if the executor is open
set /p choice="Is the executor open? (Y/N): "
if /I "%choice%" NEQ "Y" (
    echo Please ensure the executor is open before continuing.
    pause
    exit /b
)

:: Start the server in a new command prompt window and keep it open
start cmd /k "node server.js"

:: Wait for a moment to ensure the server starts before opening the application
timeout /t 3

:: Open a new Chrome window in app mode to display the webpage
start chrome --app="http://localhost:8000"

:: Prompt user to start the executor manually
echo Please start the executor manually after this window opens.
