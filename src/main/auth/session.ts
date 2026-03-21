import { session, Cookie } from 'electron';

const PARTITION = 'persist:authSession';

export async function getCookies(): Promise<Cookie[]> {
  return await session
    .fromPartition(PARTITION)
    .cookies.get({});
}

export function buildCookieHeader(cookies: Cookie[]): string {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ');
}