import { app } from 'electron';
import path from 'node:path';

const Store = require('electron-store').default;

export const store = new Store({
    installations: {},
    defaults: {
        installationsFolder: path.join(app.getPath('userData'), 'KLuncher_installations'),
        modsFolder: path.join(app.getPath('userData'), 'KLuncher_mods'),
        backupsFolder: path.join(app.getPath('userData'), 'KLuncher_backups')
    }
});

// store.reset('installationsFolder', 'modsFolder', 'backupsFolder');
