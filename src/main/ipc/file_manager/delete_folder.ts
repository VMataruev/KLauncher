import { ipcMain } from "electron";
const fs = require('fs');

ipcMain.handle('delete-folder', async(_event, folderPath) => {
    try {
        fs.rm(folderPath, { recursive: true, force: true });
        console.log('Folder deleted successfully', folderPath);
    } catch (err) {
        console.error('Error deleting folder:', err);
    }
})