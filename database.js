// database.js
const { app } = require('electron');
const path = require('path');
const loki = require('lokijs');

// Make sure this code runs in the main process (which it should)
const userDataPath = app.getPath('userData'); // gets something like /Users/username/Library/Application Support/YourAppName
const dbPath = path.join(userDataPath, 'data.json');

function initializeDatabase() {
  return new Promise((resolve) => {
    db = new loki(dbPath, {
      autoload: true,
      autoloadCallback: () => {
        if (!db.getCollection('users')) {
          db.addCollection('users');
          db.saveDatabase();
        }
        resolve(); // Ensure resolve is called correctly here
      },
      autosave: true,
      autosaveInterval: 4000, // Save every 4 seconds
    });
  });
}

function insertUser(name) {
  const users = db.getCollection('users');
  users.insert({ name });
  db.saveDatabase();
}

function getAllUsers() {
  const users = db.getCollection('users');
  return users.find();
}

module.exports = {
  initializeDatabase,
  insertUser,
  getAllUsers,
};
