import { app } from 'electron';
import path from 'node:path';

const Store = require('electron-store').default;

export const store = new Store({
    installations: {},
    defaults: {
        installationsFolder: path.join(app.getPath('userData'), 'KLuncher_installations'),
        VS_versions: path.join(app.getPath('userData'), 'KLuncher_VS_versions'),
        modsFolder: "",
        backupsFolder: path.join(app.getPath('userData'), 'KLuncher_backups')
    },
    installation_to_start: ""
});

// store.reset('installationsFolder', 'modsFolder', 'backupsFolder');
