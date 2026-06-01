// types/global.d.ts
declare global {
    type Mod = {
        modid: number;
        modidstrs: string[]     
        assetid: number     
        name: string;
        author: string      
        summary: string     
        downloads: number;
        follows: number;
        comments: number;
        trendingpoints: number      
        lastreleased: string        
        logo: string;
        urlalias: string        
        type: "mod" | string;
        side: "client" | "server" | "both" | string     
        tags: string[];
        version: string;
    };

  type Installation = {
    id: string;
    img: string;
    name: string;
    version: string;
    version_link: string;
    mods: Mod[];
    folder: string | null;
    time_played: number;
  };
  
}

export {}; // Важно: чтобы файл считался модулем