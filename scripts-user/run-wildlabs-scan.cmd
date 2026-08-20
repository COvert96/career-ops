@echo off
REM Wrapper for the weekly Windows Scheduled Task "career-ops-wildlabs-scan".
REM
REM Registered with (Monday 08:47 local):
REM   Register-ScheduledTask -TaskName "career-ops-wildlabs-scan" ...
REM Inspect / remove:
REM   Get-ScheduledTask -TaskName career-ops-wildlabs-scan
REM   Start-ScheduledTask -TaskName career-ops-wildlabs-scan     (run now)
REM   Unregister-ScheduledTask -TaskName career-ops-wildlabs-scan -Confirm:$false
REM
REM Appends to output\wildlabs-scan.log (output\ is gitignored).

setlocal
REM UTF-8 code page, otherwise em-dashes in the script output are mangled in the log.
chcp 65001 > nul

set REPO=C:\Users\chris\Documents\Programming\career-ops
cd /d "%REPO%" || exit /b 1

if not exist "output" mkdir "output"

echo. >> "output\wildlabs-scan.log"
echo ===== %DATE% %TIME% ===== >> "output\wildlabs-scan.log"

"C:\Program Files\nodejs\node.exe" scripts-user\scan-wildlabs.mjs >> "output\wildlabs-scan.log" 2>&1
set RC=%ERRORLEVEL%

echo exit code: %RC% >> "output\wildlabs-scan.log"
exit /b %RC%
