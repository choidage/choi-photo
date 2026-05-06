@echo off
cd /d "%~dp0"
echo Starting gallery image scan...

python update_gallery.py
if %errorlevel% neq 0 (
    echo [INFO] 'python' command failed. Trying 'python3'...
    python3 update_gallery.py
    if %errorlevel% neq 0 (
        echo [INFO] 'python3' command failed. Trying 'py'...
        py update_gallery.py
        if %errorlevel% neq 0 (
            echo ========================================================
            echo [ERROR] Python is not installed or not in PATH!
            echo Please install Python from python.org to use this feature.
            echo ========================================================
        )
    )
)

echo.
echo Update process finished! Please refresh your web browser.
pause
