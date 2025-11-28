# ORRBUS Hyderabad

A public bus information website for Hyderabad built using GTFS data.

Features:
- Route list
- Stops list with maps
- From → To trip planner
- GTFS-powered backend (Node + SQLite)
- Leaflet map frontend

## Backend Setup
cd backend
npm install
node gtfs_import.js # imports your GTFS into SQLite
node server.js # starts API on port 8080

## Frontend Setup
Upload the `frontend/` folder to your hosting.

## API Endpoints
- `/api/routes`
- `/api/route/:id/stops`
- `/api/plan?from=X&to=Y`

## Deployment
Frontend: cPanel / static hosting  
Backend: Node hosting (Render, Railway, VPS)
