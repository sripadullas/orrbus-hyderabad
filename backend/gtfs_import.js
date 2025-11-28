import sqlite3 from "sqlite3";
import fs from "fs";
import csv from "csv-parser";

const db = new sqlite3.Database("./db.sqlite");

const GTFS_TABLES = ["routes", "trips", "stops", "stop_times"];

async function importTable(table) {
  return new Promise(resolve => {
    const rows = [];
    fs.createReadStream(`./gtfs/${table}.txt`)
      .pipe(csv())
      .on("data", r => rows.push(r))
      .on("end", () => {
        const keys = Object.keys(rows[0]);
        const placeholders = keys.map(() => "?").join(",");

        const sql =
          `DROP TABLE IF EXISTS ${table};
           CREATE TABLE ${table} (${keys.join(" TEXT, ")} TEXT);`;

        db.exec(sql);

        const stmt = db.prepare(
          `INSERT INTO ${table} (${keys.join(",")}) VALUES (${placeholders})`
        );

        rows.forEach(row => stmt.run(Object.values(row)));

        stmt.finalize();
        resolve();
      });
  });
}

async function start() {
  for (const t of GTFS_TABLES) {
    console.log("Importing", t);
    await importTable(t);
  }
  console.log("GTFS Import Completed");
  db.close();
}

start();
