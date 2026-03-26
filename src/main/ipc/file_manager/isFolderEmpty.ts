import { ipcMain } from 'electron';
import fs from 'fs/promises';

ipcMain.handle('isFolderEmpty', async (_event, folderPath: string) => {
    try {
        const files = await fs.readdir(folderPath);
        return files.length === 0;
    } catch (error) {
        console.error('Ошибка при проверке папки:', error);
        return false;
    }
})

