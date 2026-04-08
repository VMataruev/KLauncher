import { app } from 'electron';
import path from 'node:path';

const Store = require('electron-store').default;

export const store = new Store({
    installations: {},
    defaults: {
        installationsFolder: path.join(app.getPath('userData'), 'KLuncher_installations'),
        modsStashFolder: path.join(app.getPath('userData'), 'KLuncher_mods_stash'),
        modsFolder: "",
        backupsFolder: path.join(app.getPath('userData'), 'KLuncher_backups')
    }
});

// store.reset('installationsFolder', 'modsFolder', 'backupsFolder');
