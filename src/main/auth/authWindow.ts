import { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { fetchProtectedData } from './api';

export function createAuthWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1800,
    height: 700,
    webPreferences: {
      partition: 'persist:authSession',
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadURL('https://account.vintagestory.at/');


//   TODO: Исправить логику закрытия окна. Тут он пытается закрыть после редиректа, но редиректа не будет. Нужно отследить изменение куки и тогда закрыть страницу
  win.webContents.on('did-navigate', (_event, url: string) => {
    if (url.includes('/dashboard')) {
      console.log('Авторизация успешна');
      win.close();
    }
  });

  return win;
}
// ===================================================================


ipcMain.handle('open-login', async (): Promise<void> => {
  createAuthWindow();
});

ipcMain.handle('get-data', async () => {
  return await fetchProtectedData();
});