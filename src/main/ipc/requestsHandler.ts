import { ipcMain } from "electron";
import axios from "axios";

ipcMain.handle('get-request', async (_event, url: string) => {
    try {
        const res = await axios.get(url);
        // console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error)
        return error
    }
});