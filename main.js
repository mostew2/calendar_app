const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./database');

console.log("Starting main process..."); // Add this log

function createWindow() {
  console.log("Creating window..."); // Add this log
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(() => {
  console.log("App is ready..."); // Add this log
  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (row.count === 0) {
      db.run('INSERT INTO users (name) VALUES (?)', ['Alice']);
      db.run('INSERT INTO users (name) VALUES (?)', ['Bob']);
    }
  });

  ipcMain.handle('fetch-users', async () => {
    console.log('Fetching users from database...');
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          console.log('Fetched users:', rows);
          resolve(rows);
        }
      });
    });
  });

  ipcMain.handle('add-user', async (event, name) => {
    console.log('Adding user:', name);
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO users (name) VALUES (?)', [name], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log('User added:', { id: this.lastID, name });
          resolve({ id: this.lastID, name });
        }
      });
    });
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
