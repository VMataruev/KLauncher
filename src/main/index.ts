import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/Logo.png?asset'
import "./ipc";
import fs from 'fs-extra';
// import { store } from './store'
import "./auth"
// const path = require('path');
import path from 'path';
// require('update-electron-app')();
import { updateElectronApp } from 'update-electron-app';


function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1250,
    height: 730,
    minWidth: 1250,
    minHeight: 730,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../../resources/Logo.ico'),
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'))
  }
}


// Создаём папку для данных приложения
async function initAppDataFolder(folderName: string) {
    try {
      // Получаем путь к папке AppData/Roaming
      // Результат: C:\Users\username\AppData\Roaming
        const userDataPath = app.getPath('appData');
        const customFolder = path.join(userDataPath, folderName);
        
        if (!fs.existsSync(customFolder)) {
            await fs.ensureDir(customFolder);
            console.log('Folder created:', customFolder);
        }
        
        return customFolder;
    } catch (error) {
        console.error(`Error creating folder ${folderName}:`, error);
        return null;
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('KLauncher')
  
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  initAppDataFolder('KLuncher_VS_versions');
  initAppDataFolder('KLuncher_installations');
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  if (!is.dev) { // Только в production, не в разработке
    // require('update-electron-app')();
    updateElectronApp();
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
