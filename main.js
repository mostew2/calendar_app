const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initializeDatabase, insertUser, getAllUsers } = require('./database');

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
  initializeDatabase().then(() => {
    ipcMain.handle('fetch-users', async () => {
      const allUsers = getAllUsers();
      return allUsers;
    });
  
    ipcMain.handle('add-user', async (event, name) => {
      insertUser(name);
    });
  
    createWindow();
  })
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
