import { ipcMain } from "electron";
import { spawn, ChildProcess } from "child_process";
import path from "path";

let game: ChildProcess | null = null;

ipcMain.handle("game-start", async (_event, folder: string) => {

    let msg = "";
    let status = "";
    if (game) {
        console.log('Game already running');
        status = "warning"
        msg = "Game already running";
        return {status: status, msg: msg};
    }

    const exePath = path.join(folder, "Vintagestory.exe");
    const fs = await import('fs');
    if (!fs.existsSync(exePath)) {
        return {
            status: "error",
            msg: `Game executable not found at: ${exePath}`
        };
    }

    game = spawn(exePath, [], {
        cwd: folder,
        detached: false
    });
    // console.log("Game started");
    // status = "success"
    // msg = "Game started"

    game.on('spawn', () => {
        console.log('Process spawned');
        status = "success"
        msg = "Game started"
    });

    game.on('close', (code) => {
        console.log('Game closed with code:', code);
        status = "error"
        msg = `Game closed with code: ${code}`
        game = null;
    });

    game.on('error', (err) => {
        console.error('Failed to start:', err);
        status = "error";
        msg = `Failed to start: ${err}`
        game = null;
    });

    game.stdout?.on('data', (data) => {
        console.log('[GAME LOG]', data.toString());
    });

    game.stderr?.on('data', (data) => {
        console.error('[GAME ERROR]', data.toString());
        status = "error";
        msg = `[GAME ERROR] ${data.toString()}`;
    });

    return {status: status, msg: msg}
});


ipcMain.handle("game-kill", async () => {
    if (!game) return;

    game.kill();
    game = null;
});