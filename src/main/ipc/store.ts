import { ipcMain } from "electron";
import { store } from '../store'

ipcMain.handle('set-store', async (_event, key, value) => {
    try {
        store.set(key, value);
        return `Added key: ${key}, value: ${value}`
    } catch (error) {
        return error;
    }
});

ipcMain.handle('get-store', async (_event, key) => {
    try {
        const res = store.get(key);
        return res;
    } catch (error) {
        return error;
    }
});

ipcMain.handle('delete-store', async (_event, key) => {
    try {
        store.delete(key);
        return `Deleted key: ${key}`;
    } catch (error) {
        return error;
    }
});