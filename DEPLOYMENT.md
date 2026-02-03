# AcademicGen Engine - Railway Deployment Guide

## Overview
This application consists of:
- **Frontend**: React + Vite (served as static files)
- **Backend**: Python Flask API (generates Word documents)

## Railway Deployment Steps

### 1. Prerequisites
- Railway account
- Git repository connected to Railway

### 2. Environment Variables
Set the following environment variables in Railway dashboard:
- `PERPLEXITY_API_KEY` - Your Perplexity API key

### 3. Deploy
Railway will automatically:
1. Install Node.js and Python dependencies
2. Build the React app (`npm run build`)
3. Start the Flask server (`python server.py`)

The Flask server will:
- Bind to Railway's dynamic `PORT` environment variable
- Serve the built React app from the `dist` folder
- Handle API requests at `/api/*`

### 4. Verify Deployment
After deployment:
- Visit your Railway app URL
- The React app should load
- Test Word document generation

## Local Development

### Running Locally
You need to run both the React dev server and the Python Flask server:

**Terminal 1 - React Frontend:**
```bash
npm run dev
```
- Runs on http://localhost:3000
- API calls to `/api/*` are proxied to Flask server

**Terminal 2 - Python Backend:**
```bash
python server.py
```
- Runs on http://localhost:5000
- Handles document generation

### Production Build Test
To test the production setup locally:

1. Build the React app:
```bash
npm run build
```

2. Start Flask server (it will serve the built app):
```bash
python server.py
```

3. Visit http://localhost:5000

## Architecture Notes
- In development: Vite proxy forwards `/api/*` to Flask
- In production: Flask serves both static files and API endpoints
- React uses relative URLs (`/api/*`) that work in both environments
