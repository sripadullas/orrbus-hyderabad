import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(cors());

const db = new sqlite3.Database("./db.sqlite");

/* List all routes */
app.get("/api/routes", (req, res) => {
  db.all(
    "SELECT * FROM routes ORDER BY route_short_name ASC",
    [],
    (err, rows) => res.json(rows)
  );
});

/* Stops for a route */
app.get("/api/route/:route_id/stops", (req, res) => {
  const q = `
    SELECT stops.*
    FROM stops
    JOIN stop_times ON stops.stop_id = stop_times.stop_id
    JOIN trips ON stop_times.trip_id = trips.trip_id
    WHERE trips.route_id = ?
    GROUP BY stops.stop_id
    ORDER BY stop_times.stop_sequence ASC;
  `;
  db.all(q, [req.params.route_id], (err, rows) => res.json(rows));
});

/* Simple route planner */
app.get("/api/plan", (req, res) => {
  const { from, to } = req.query;

  const q = `
    SELECT r.route_id, r.route_short_name,
           s1.stop_name AS from_stop,
           s2.stop_name AS to_stop
    FROM routes r
    JOIN trips t ON r.route_id = t.route_id
    JOIN stop_times st1 ON t.trip_id = st1.trip_id
    JOIN stop_times st2 ON t.trip_id = st2.trip_id
    JOIN stops s1 ON s1.stop_id = st1.stop_id
    JOIN stops s2 ON s2.stop_id = st2.stop_id
    WHERE s1.stop_name LIKE ?
      AND s2.stop_name LIKE ?
      AND st1.stop_sequence < st2.stop_sequence
    GROUP BY r.route_id
    LIMIT 20;
  `;

  db.all(q, [`%${from}%`, `%${to}%`], (err, rows) => res.json(rows));
});

app.listen(8080, () =>
  console.log("ORRBUS Hyderabad API running on http://localhost:8080")
);
