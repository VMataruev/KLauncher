import { ipcMain, session, webContents } from 'electron';
import { spawn } from 'child_process';
import path from 'path';


ipcMain.handle('download_and_install_game', async (ipcEvent, url: string, outputPath: string) => {
    return new Promise((resolve, reject) => {
        session.defaultSession.once('will-download', (_downloadEvent, item, webContents) => {
            const fileName = path.basename(new URL(url).pathname);
            const fullPath = path.join(outputPath, fileName);
            // console.log(outputPath);
            // console.log(fileName);
            // console.log(fullPath);
            item.setSavePath(fullPath);


            item.on('updated', (event, state) => {
                const receivedBytes = item.getReceivedBytes();
                const totalBytes = item.getTotalBytes();
                const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;

                ipcEvent.sender.send("download-progress", {
                    state,
                    receivedBytes,
                    totalBytes,
                    percent,
                    fileName,
                });

                // console.log(item.getReceivedBytes());
            });


            item.on('done', (event,state) => {
                // console.log(state);
                if (state === 'completed') {

                    ipcEvent.sender.send('download-progress', {
                        state: 'completed',
                        receivedBytes: item.getReceivedBytes(),
                        totalBytes: item.getTotalBytes(),
                        percent: 100,
                        fileName,
                    });

                    spawn(fullPath, ["/SILENT", "/SP-", `/DIR=${outputPath}`], {
                    // spawn(fullPath, [`/DIR="x:\dirname"`], {
                        detached: true,
                        stdio: 'ignore'
                    }).unref();

                    resolve({
                        success: true,
                        message: 'downloaded and started',
                        path: fullPath    
                    });
                } else {
                    ipcEvent.sender.send('download-progress', {
                        state: 'failed',
                        fileName
                    })
                    reject(new Error(`download  failed: ${state}`))
                }
            });
        });
        session.defaultSession.downloadURL(url);
    });
})

