// database.js
const { app } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Make sure this code runs in the main process (which it should)
const userDataPath = app.getPath('userData'); // gets something like /Users/username/Library/Application Support/YourAppName
const dbPath = path.join(userDataPath, 'data.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to the SQLite database at ${dbPath}`);
  }
});

// Create the table if not exists
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');

module.exports = db;
