import { ipcMain } from "electron";
import path from "path";
const fs = require('fs/promises');

ipcMain.handle('hasFolder', async(_event, folderPath, targetName) => {
    try {
        const items = await fs.readdir(folderPath, { withFileTypes: true });
        return items.some(item =>
        item.isDirectory() && item.name === targetName
    );
    } catch {
        return false
    }
})