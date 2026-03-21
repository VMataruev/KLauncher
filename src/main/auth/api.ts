import axios from 'axios';
import { getCookies, buildCookieHeader } from './session';
import * as cheerio from 'cheerio';

interface Version {
    name: string;
    link: string;
}

let versions_stable: Version[] = [];
let versions_unstable: Version[] = [];

// TODO: Добавить вывод и нестабильных версий
export async function fetchProtectedData(): Promise<any> {
    const cookies = await getCookies();
    const cookieHeader = buildCookieHeader(cookies);

    const res = await axios.get('https://account.vintagestory.at/', {
    headers: {
      Cookie: cookieHeader
    }
    });

    const $ = cheerio.load(res.data);
    versions_stable = [];
    versions_unstable = [];

    const v_stable = $('.tabpane.stable');
    const v_ammount = v_stable.children();

    for (let i = 0; i < v_ammount.length; i++) {
        const version = v_stable.children().eq(i);
        const version_name = version.find('b').text();
        const version_link = version.find('a').attr('href')
        if (version_name && version_link) {
            versions_stable.push({
                name: version_name,
                link: version_link
            });
        };
    };

    return versions_stable
    console.log(versions_stable);


    // return res.data;
}