import { ipcMain, shell } from "electron";

ipcMain.handle("open-external-link", async (_event, url: string) => {
  await shell.openExternal(url);
});