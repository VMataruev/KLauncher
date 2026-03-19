import { ipcMain, dialog } from "electron";

ipcMain.handle('select-folder', async() => {
    const res = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (!res.canceled) {
        return res.filePaths[0]
    }
    return null;
})