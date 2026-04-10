import { ipcMain } from "electron";
import fs from "fs/promises";

ipcMain.handle('rename-folder', async(_event, oldPath: string, newPath: string) => {
    try {
        await fs.rename(oldPath, newPath);
        return {status: "success"}
    } catch (error) {
        console.log(error);
        return {status: "error", error: error}
    }
})