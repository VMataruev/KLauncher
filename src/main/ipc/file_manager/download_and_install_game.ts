import { ipcMain, session, webContents } from 'electron';
import { spawn } from 'child_process';
import path from 'path';


ipcMain.handle('download_and_install_game', async (_event, url: string, outputPath: string) => {
    return new Promise((resolve, reject) => {
        session.defaultSession.once('will-download', (event, item, webContents) => {
            const fileName = path.basename(new URL(url).pathname);
            const fullPath = path.join(outputPath, fileName);
            item.setSavePath(fullPath);
            item.on('updated', (event, state) => console.log(item.getReceivedBytes()));
            item.on('done', (event,state) => {
                console.log(state);
                if (state === 'completed') {
                    spawn(fullPath, [], {
                        detached: true,
                        stdio: 'ignore'
                    }).unref();

                    resolve('downloaded and started');
                } else {
                    reject(`download  failed: ${state}`)
                }
            });
        });
        session.defaultSession.downloadURL(url);
    });
})

