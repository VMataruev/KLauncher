import { ipcMain } from "electron";
const fs = require('fs');
import axios from "axios";

ipcMain.handle("downloadFile", async (_event, url: string, pathToSave: string) => {
    try {
        const writer = fs.createWriteStream(pathToSave);

        const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
        });

        response.data.pipe(writer);

        return await new Promise((resolve, reject) => {
            writer.on("finish", () => resolve(true));
            writer.on("error", (err) => reject(err));
        });
    } catch (error) {
        console.log(error);
        return error;
    }
});