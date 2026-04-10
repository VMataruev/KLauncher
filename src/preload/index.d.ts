import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    getRequest: <T = any>(url: string) => Promise<T>
    selectFolder: () => Promise<string | null>
    openFolder: (folderpath) => Promise<string | null>
    getVersions: () => Promise<string | null>
    login: (url, body: { email: string; password: string; twofacode?: string; preLoginToken?: string }) => Promise<any>
    setStore: (key, value) => Promise<string>
    getStore: (key) => Promise<any>
    deleteStore: (key) => Promise<string>
    openLogin: () => Promise<any>
    getData: <T = any>() => Promise<T>  
    isFolderEmpty: (folderPath) => Promise<boolean>
    download_and_install_game: (url: string, outputPath: string) => Promise
    downloadProgress: (
      callback: (data: {
        state: string;
        receivedBytes?: number;
        totalBytes?: number;
        percent?: number;
        fileName?: string;
      }) => void
    ) => () => void;
    open_file: (path: string) => Promise
    openExternalLink: (url: string) => Promise
    createFolder: (folderPath: string, folderName: string) => Promise
    deleteFolder: (folderPath: string) => Promise
    isFileExist: (filePath: string) => Promise<boolean>
    downloadFile: (url: string, pathToSave: string) => Promise
    deleteFile: (filePath: string) => Promise
    getFilesNames: (path: string) => Promise
    downloadFileProgress: (
      callback: (data: {
        received?: number;
        percent?: number;
        total?: number;
        fileName?: string;
      }) => void
    ) => () => void;
    renameFolder: (oldPath: string, newPath: string) => Promise
    clearFolder: (folderPath: string) => Promise
  };
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
