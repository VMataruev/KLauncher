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
  download_and_install_game: (url: string, outputPath: string) => ipcRenderer.invoke('download_and_install_game', url, outputPath),
  downloadProgress: (callback: (data: any) => void) => {
    const listener = (_event: unknown, data: any) => callback(data);
    ipcRenderer.on('download-progress', listener);
    return () => {
      ipcRenderer.removeListener('download-progress', listener);
    }
  },
  open_file: (path: string) => ipcRenderer.invoke('open-file', path),
  openExternalLink: (url: string) => ipcRenderer.invoke("open-external-link", url),
  createFolder: (folderPath: string, folderName: string) => ipcRenderer.invoke('create-folder', folderPath, folderName),
  deleteFolder: (folderPath: string) => ipcRenderer.invoke('delete-folder', folderPath)
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
