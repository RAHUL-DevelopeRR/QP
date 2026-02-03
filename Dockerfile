# Stage 1: Build React app
FROM node:20-slim AS frontend-builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Python runtime
FROM python:3.10-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python server files
COPY server.py IDLE.py ./

# Copy built React app from frontend-builder stage
COPY --from=frontend-builder /app/dist ./dist

# Expose port (Railway will set PORT env var)
EXPOSE 8080

# Start the Flask server
CMD ["python", "server.py"]
