const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('openFile'),
  saveFile: (newData) => ipcRenderer.send('saveFile', newData),
  haveData: (callback) => ipcRenderer.on('haveData', callback)
})