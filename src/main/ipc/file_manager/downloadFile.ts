import { BrowserWindow, ipcMain, session } from "electron";
const fs = require('fs');
import axios from "axios";

ipcMain.handle('downloadFile', async (event, url, savePath) => {
    const win = BrowserWindow.getFocusedWindow();

    return new Promise((resolve, reject) => {
        session.defaultSession.once('will-download', (event2, item) => {

            item.setSavePath(savePath);
            const fileName = item.getFilename();

            item.on('updated', () => {
                const received = item.getReceivedBytes();
                const total = item.getTotalBytes();

                const percent = total ? Math.round((received / total) * 100) : 0;

                win?.webContents.send('download-file-progress', {
                    percent,
                    received,
                    total,
                    fileName
                });
            });

            item.once('done', (e, state) => {
                if (state === 'completed') {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });

        session.defaultSession.downloadURL(url);
    });
});