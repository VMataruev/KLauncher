import { ipcMain } from "electron";
import { spawn } from 'child_process';

ipcMain.handle('open-file', async(_event, path: string) => {
    try {
        spawn(path, [], {
            detached: true,
            stdio: 'ignore'
        }).unref();

        return {status: 'success'};
    } catch (error) {
        return {status: 'failed', error};
    }
})