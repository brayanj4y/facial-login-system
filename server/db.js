const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite DB (creates db file if not exists)
const db = new sqlite3.Database(path.resolve(__dirname, 'faces.sqlite'), (err) => {
  if (err) console.error('Database opening error:', err);
});

// Create users table
db.serialize(() => {  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      descriptor TEXT,
      imageUrl TEXT
    )
  `);
});

module.exports = db;
