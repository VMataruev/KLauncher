import { ipcMain } from "electron";
const path = require('path');
const fs = require('fs/promises');

ipcMain.handle('clear-folder', async (_event, folderPath: string) => { // pathFolder = c:/   folderName = created_folder   out = c:/created_folder
    const files = await fs.readdir(folderPath);

    try {
        await Promise.all(
            files.map(file =>
                fs.rm(path.join(folderPath, file), {
                    recursive: true,
                    force: true
                })
            )
        );
    } catch (error) {
        return {status: "error", error: error}
    }
})