import { ipcMain, session, webContents } from 'electron';
import { spawn } from 'child_process';
import path from 'path';


ipcMain.handle('download_and_install_game', async (ipcEvent, url: string, outputPath: string) => {
    return new Promise((resolve, reject) => {
        session.defaultSession.once('will-download', (_downloadEvent, item, webContents) => {
            const fileName = path.basename(new URL(url).pathname);
            // const toolPath = path.join(process.resourcesPath, "tools", "innoextract.exe");
            const toolPath = "E:\\Coding\\KLauncher\\KLauncher\\resources\\tools\\innounp.exe"
            const gameInstaller = path.join(outputPath, fileName);
            const logPath = path.join(outputPath, 'install.log');
            // console.log(outputPath);
            // console.log(fileName);
            // console.log(gameInstaller);
            item.setSavePath(gameInstaller);


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


                    // execFile(toolPath, ["-d", "game", installer], (err) => {
                    //     if (err) console.error(err);
                    // });
                    const child = spawn(toolPath, [
                        "-x", 
                        gameInstaller,
                    ], {
                    // spawn(gameInstaller, [`/DIR="x:\dirname"`], {
                        detached: false,
                        stdio: 'pipe',
                        cwd: outputPath
                    });

                    // child.unref();

                    child.stdout?.on('data', (data) => {
                        console.log(data.toString());
                    });

                    resolve({
                        success: true,
                        message: 'downloaded and started',
                        path: gameInstaller    
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

