import { ipcMain } from "electron";
const fs = require('fs');

ipcMain.handle("isFileExist", async (_event, filePath: string) => {
    if (fs.existsSync(filePath)) {
        return true;
    } else {
        return false;
    }
});