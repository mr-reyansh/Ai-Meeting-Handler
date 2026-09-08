// Database Connection - SQLite (no username/password needed)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DATABASE_FILE = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
let db;

const initializePool = async () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DATABASE_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
      if (err) {
        console.error('Failed to open SQLite database:', err);
        return reject(err);
      }
      console.log('SQLite database opened at', DATABASE_FILE);

      const initSql = `
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS meetings (
        meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_by INTEGER,
        summary TEXT,
        meeting_date DATETIME DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS transcripts (
        transcript_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER NOT NULL,
        content TEXT,
        FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tasks (
        task_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER NOT NULL,
        task_text TEXT,
        assigned_to TEXT,
        status TEXT DEFAULT 'pending',
        deadline DATETIME,
        FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS decisions (
        decision_id INTEGER PRIMARY KEY AUTOINCREMENT,
        meeting_id INTEGER NOT NULL,
        decision_text TEXT,
        FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS task_updates (
        update_id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        old_status TEXT,
        new_status TEXT,
        updated_at DATETIME DEFAULT (datetime('now')),
        FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
      );
      `;

      db.exec(initSql, (createErr) => {
        if (createErr) {
          console.error('Failed to initialize SQLite schema:', createErr);
          return reject(createErr);
        }
        console.log('SQLite schema initialized');
        resolve(db);
      });
    });
  });
};

// Execute query (SELECT)
const executeQuery = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve({ rows });
    });
  });
};

// Execute update/insert/delete
const executeUpdate = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// Close connection
const closePool = async () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing SQLite database:', err);
      } else {
        console.log('SQLite database closed');
      }
    });
  }
};

module.exports = {
  initializePool,
  executeQuery,
  executeUpdate,
  closePool
};
