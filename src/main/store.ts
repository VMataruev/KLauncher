import { app } from 'electron';
import path from 'node:path';

const Store = require('electron-store').default;

export const store = new Store({
    defaults: {
        installations: {},
        installationsFolder: path.join(app.getPath('userData'), 'KLuncher_installations'),
        VS_versions: path.join(app.getPath('userData'), 'KLuncher_VS_versions'),
        modsFolder: path.join(app.getPath('appData'), 'VintagestoryData', 'Mods'),
        backupsFolder: path.join(app.getPath('userData'), 'KLuncher_backups'),
        installation_to_start: "",
        total_played_time: 0
    }
});

// store.reset('installationsFolder', 'modsFolder', 'backupsFolder');
