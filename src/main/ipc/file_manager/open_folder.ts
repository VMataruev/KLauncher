import { ipcMain } from "electron";
const {shell} = require('electron') 

ipcMain.handle('open-folder', async(_event, folderpath: string) => {
    try {
        shell.openPath(folderpath);
    } catch (error) {
        console.log(error);
    }
})