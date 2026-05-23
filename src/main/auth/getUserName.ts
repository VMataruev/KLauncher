import axios from 'axios';
import { getCookies, buildCookieHeader } from './session';
import * as cheerio from 'cheerio';
import { ipcMain } from 'electron';

ipcMain.handle("get-user-name", async () => {
    const cookies = await getCookies();
    const cookieHeader = buildCookieHeader(cookies);

    const res = await axios.get('https://account.vintagestory.at/profile', {
    headers: {
      Cookie: cookieHeader
    }
    });

    const $ = cheerio.load(res.data);

    const userName = $('input[name="playername"]').attr('value');

    return {status: "ok", name: userName}
})
