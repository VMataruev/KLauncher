import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Api {
    getRequest: <T = any>(url: string) => Promise<T>
  }
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
