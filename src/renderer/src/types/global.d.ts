// types/global.d.ts
declare global {
  type Installation = {
    id: string;
    img: string;
    name: string;
    version: string;
    version_link: string;
    mods: string[];
    folder: string | null;
    time_played: number;
  };
  
}

export {}; // Важно: чтобы файл считался модулем