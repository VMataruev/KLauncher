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
  }
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
