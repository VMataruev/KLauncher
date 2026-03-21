import axios from 'axios';
import { getCookies, buildCookieHeader } from './session';

export async function fetchProtectedData(): Promise<any> {
  const cookies = await getCookies();
  const cookieHeader = buildCookieHeader(cookies);

  const res = await axios.get('https://account.vintagestory.at/', {
    headers: {
      Cookie: cookieHeader
    }
  });

  return res.data;
}