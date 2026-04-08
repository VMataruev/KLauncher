import { ipcMain } from "electron";
const fs = require('fs');

ipcMain.handle('delete-folder', async(_event, folderPath) => {
    try {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log('Folder deleted successfully');
    } catch (err) {
        console.error('Error deleting folder:', err);
    }
})