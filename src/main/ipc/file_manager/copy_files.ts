import { ipcMain } from "electron";
const fs = require('fs/promises');

ipcMain.handle('copy-files', async(_event, pathFrom, pathTo) => {
    await fs.cp(pathFrom, pathTo, {
        recursive: true,
        force: true
    })
})