const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script loaded..."); // Add this log

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  },
});
