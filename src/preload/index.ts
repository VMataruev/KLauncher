import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getRequest: <T = any>(url: string): Promise<T> => ipcRenderer.invoke('get-request', url),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFolder: (folderpath) => ipcRenderer.invoke('open-folder', folderpath),
  getVersions: () => ipcRenderer.invoke('get-versions'),
  login: (url, body: { email: string; password: string; twofacode?: string; preLoginToken?: string }) => ipcRenderer.invoke('vs-login', url, body),
  setStore: (key, value) => ipcRenderer.invoke('set-store', key, value),
  getStore: (key) => ipcRenderer.invoke('get-store', key),
  deleteStore: (key) => ipcRenderer.invoke('delete-store', key),
  openLogin: (): Promise<void> => ipcRenderer.invoke('open-login'),
  getData: <T = any>(): Promise<T> => ipcRenderer.invoke('get-data'),
  isFolderEmpty: (folderPath) => ipcRenderer.invoke('isFolderEmpty', folderPath),

  downloadGame: (url: string, outputPath: string) => ipcRenderer.invoke('download-Game', url, outputPath),
  downloadGameProgress: (callback: (data: any) => void) => {
    const listener = (_event: unknown, data: any) => callback(data);
    ipcRenderer.on('download-game-progress', listener);
    return () => {
      ipcRenderer.removeListener('download-game-progress', listener)
    }
  },

  extractGame: (url: string, outputPath: string) => ipcRenderer.invoke('extract-Game', url, outputPath),
  extractGameProgress: (callback: (data: any) => void) => {
    const listener = (_event: unknown, data: any) => callback(data);
    ipcRenderer.on('extract-game-progress', listener);
    return () => {
      ipcRenderer.removeListener('extract-game-progress', listener)
    }
  },

  open_file: (path: string) => ipcRenderer.invoke('open-file', path),
  openExternalLink: (url: string) => ipcRenderer.invoke("open-external-link", url),
  createFolder: (folderPath: string, folderName: string) => ipcRenderer.invoke('create-folder', folderPath, folderName),
  deleteFolder: (folderPath: string) => ipcRenderer.invoke('delete-folder', folderPath),
  isFileExist: (filePath: string) => ipcRenderer.invoke('isFileExist', filePath),
  downloadFile: (url: string, pathToSave: string) => ipcRenderer.invoke('downloadFile', url, pathToSave),
  deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
  getFilesNames: (path: string) => ipcRenderer.invoke('get-files-names', path),
  downloadFileProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('download-file-progress', listener);
    return () => {
        ipcRenderer.removeListener('download-file-progress', listener);
    };
  },
  renameFolder: (oldPath: string, newPath: string) => ipcRenderer.invoke('rename-folder', oldPath, newPath),
  clearFolder: (folderPath: string) => ipcRenderer.invoke('clear-folder', folderPath),
  getModsInCache: () => ipcRenderer.invoke('get-mods-in-cache'),
  clearModsCache: () => ipcRenderer.invoke('clear-mods-cache'),
  getCookies: () => ipcRenderer.invoke('get-cookies'),
  gameStart: (folder: string) => ipcRenderer.invoke('game-start', folder),
  gameKill: () => ipcRenderer.invoke('game-kill'),
  copyFiles: (pathFrom: string, pathTo: string) => ipcRenderer.invoke('copy-files', pathFrom, pathTo),
  hasFolder: (folderPath: string, targetName: string) => ipcRenderer.invoke('hasFolder', folderPath, targetName)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
