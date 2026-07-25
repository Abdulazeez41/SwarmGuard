#!/bin/bash
set -e

echo "🚀 Starting SwarmGuard FastAPI Backend..."
cd /app/backend
/app/backend/.venv/bin/uvicorn api_server:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "⚙️ Configuring OpenClaw to use local MCP server..."
openclaw mcp set SwarmGuard '{"command":"/app/backend/.venv/bin/python","args":["/app/backend/mcp_server.py"],"cwd":"/app/backend"}'

echo "🦞 Starting OpenClaw Gateway..."
# The 'exec' command ensures OpenClaw becomes the main process, allowing Render to monitor its health
exec openclaw gateway