import { ipcMain } from "electron";
import axios from "axios";

let modsCache: any[] | null = null;
let modsCacheTime = 0;

const CACHE_TTL = 30 * 60 * 1000; // first numb is how much minutes cash will not be cleaned

ipcMain.handle("get-mods-in-cache", async () => {
    const now = Date.now();

    if (modsCache && now - modsCacheTime < CACHE_TTL) {
        return {
            status: "ok",
            mods: modsCache,
            fromCache: true
        };
    }

    try {
        const res = await axios.get("http://mods.vintagestory.at/api/mods");
        modsCache = res.data.mods;
        modsCacheTime = now;

        return {
            status: "ok",
            mods: modsCache,
            fromCache: false
        };
    } catch (error) {
        return {
            status: "error",
            error: error
        }
    }
    
});

ipcMain.handle("clear-mods-cache", async () => {
    modsCache = null;
    return true;
});