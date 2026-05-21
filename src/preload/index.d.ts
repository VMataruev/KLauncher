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

    downloadGame: (url: string, outputPath: string) => Promise
    downloadGameProgress: (
      callback: (data: {
        state: string;
        receivedBytes?: number;
        totalBytes?: number;
        percent?: number;
        fileName?: string;
      }) => void
    ) => () => void;

    extractGame: (url: string, outputPath: string) => Promise
    extractGameProgress: (
      callback: (data: {
          state: string;           // 'started' | 'extracting' | 'completed' | 'failed' | 'error'
          percent?: number;        // процент распаковки (0-100)
          fileName?: string;       // имя файла
          message?: string;        // дополнительное сообщение
          extractedFiles?: number; // количество извлечённых файлов
          totalFiles?: number;     // всего файлов
          currentFile?: string;    // текущий распаковываемый файл
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
    getModsInCache: () => Promise;
    clearModsCache: () => Promise<boolean>;
    getCookies: () => Promise
    gameStart: (folder: string) => Promise
    gameKill: () => Promise
    copyFiles: (pathFrom, pathTo) => Promise
    hasFolder: (folderPath, targetName) => Promise
  };
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
