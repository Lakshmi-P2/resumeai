@echo off
start cmd /k "cd /d C:\Users\Divya\lakshmi\frontend && npm run dev"
start cmd /k "cd /d C:\Users\Divya\lakshmi\backend && npm run dev"
start cmd /k "cd /d C:\Users\Divya\lakshmi\ai-service && python -m uvicorn main:app --reload --port 8000"
echo All services started!