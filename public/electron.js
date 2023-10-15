const { app, BrowserWindow, ipcMain,  Tray } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;

const filePath = path.join('../../daily.json');
if (!fs.existsSync(filePath)) {
  // If the file doesn't exist, create it with some initial data
  const initialData = { tasks: [] };
  fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8');
}

async function handleFileOpen () {
  fs.readFile(filePath, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    mainWindow.webContents.send('haveData', data)
  })
}

function handleSaveFile(event, newData) {
  const formattedData = { tasks: newData.map((task) => task) };
  try {
    fs.writeFileSync(filePath, JSON.stringify(formattedData, null, 2), 'utf-8');
    console.log('Data saved successfully.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 800,
    x: 1500,
    y: 100,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
    opacity: 0.8,
    titleBarStyle: 'hidden',
    backgroundColor: '#eab676',
  });

  // Hide the taskbar icon
  mainWindow.setSkipTaskbar(true);

  // Load the index.html from a URL
  mainWindow.loadFile("./build/index.html");

  // Create a tray icon
  tray = new Tray(path.join(__dirname, './favicon.ico')); // Replace with the path to your icon image

  // Set a tooltip for the tray icon
  tray.setToolTip('To Do List');

  // Handle tray icon click to show/hide the main window
  tray.on('click', () => {
      mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle('openFile', handleFileOpen)
  ipcMain.on('saveFile', handleSaveFile)
  createWindow()
})

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
