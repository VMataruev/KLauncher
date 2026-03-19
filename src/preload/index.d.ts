import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    getRequest: <T = any>(url: string) => Promise<T>
    selectFolder: () => Promise<string | null>
    getVersions: () => Promise<string | null>
  }
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
