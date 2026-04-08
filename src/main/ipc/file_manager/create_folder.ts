import { ipcMain } from "electron";
const path = require('path');
const fs = require('fs');

ipcMain.handle('create-folder', async(_event, pathFolder, folderName) => { // pathFolder = c:/   folderName = created_folder   out = c:/created_folder
    try {
        const targetPath = path.join(pathFolder, folderName);
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
            return {status: 'success'};
        }
        return {status: 'folder already exist'};
    } catch (error) {
        return {status: error}
    }
})