import { ipcMain, session } from "electron";
import path from 'path';

ipcMain.handle('download-Game', async (ipcEvent, url: string, outputPath: string) => {
    const fileName = path.basename(new URL(url).pathname);
    const gameInstallerPath = path.join(outputPath, fileName);
    // const logPath = path.join(outputPath, 'install.log');

    return new Promise((resolve, reject) => {
        session.defaultSession.once('will-download', (_downloadEvent, item, _webContents) => {
            item.setSavePath(gameInstallerPath);

            item.on('updated', (_event, state) => {
                const receivedBytes = item.getReceivedBytes();
                const totalBytes = item.getTotalBytes();
                const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;

                ipcEvent.sender.send('download-game-progress', {
                    state,
                    receivedBytes,
                    totalBytes,
                    percent,
                    fileName,
                })
            })

            item.on('done', (_event, state) => {
                if (state === 'completed') {
                    ipcEvent.sender.send('download-game-progress', {
                        state: 'completed',
                        receivedBytes: item.getReceivedBytes(),
                        totalBytes: item.getTotalBytes(),
                        percent: 100,
                        fileName,
                    });

                    resolve({
                        success: true,
                        message: 'Download completed',
                        path: gameInstallerPath
                    })
                } else if (state === 'cancelled') {
                    reject(new Error('Download was cancelled'));
                } else if (state === 'interrupted') {
                    reject(new Error('Download was interrupted'));
                } else {
                    reject(new Error(`Download failed: ${state}`));
                }
            })
        })

        session.defaultSession.downloadURL(url);
    })
})