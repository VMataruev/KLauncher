import { ipcMain } from "electron";
const fs = require('fs/promises');


ipcMain.handle("get-files-names", async (_event, path: string) => {
    try {
        const files = await fs.readdir(path);
        return files;
    } catch (error) {
        console.log(error)
        return error;
    }
});