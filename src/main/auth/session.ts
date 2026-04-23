import { session, Cookie, ipcMain } from 'electron';

const PARTITION = 'persist:authSession';

export async function getCookies(): Promise<Cookie[]> {
  return await session
    .fromPartition(PARTITION)
    .cookies.get({});
}

ipcMain.handle('get-cookies', async () => {
  return await getCookies();
});

export function buildCookieHeader(cookies: Cookie[]): string {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ');
}