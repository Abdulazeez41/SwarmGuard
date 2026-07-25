# Use a base image with Node.js
FROM node:20-slim

# Install Python and build essentials
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# 1. Setup Python Backend
COPY backend/requirements.txt /app/backend/
RUN python3 -m venv /app/backend/.venv
RUN /app/backend/.venv/bin/pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# 2. Install OpenClaw globally
RUN npm install -g @openclaw/cli

# Create directories for OpenClaw state and workspace (matching render.yaml)
RUN mkdir -p /data/.openclaw /data/workspace

# Expose ports (10000 for OpenClaw, 8000 for FastAPI)
EXPOSE 10000 8000

# 3. Copy and prepare startup script
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Run the startup script
CMD ["/app/startup.sh"]