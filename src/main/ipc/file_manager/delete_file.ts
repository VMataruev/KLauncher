import { ipcMain } from "electron";
const fs = require('fs/promises');

ipcMain.handle('delete-file', async(_event, filePath) => {
    try {
        await fs.unlink(filePath);
        console.log('File deleted successfully: ', filePath);
    } catch (err) {
        console.error('Error deleting folder:', err);
    }
})