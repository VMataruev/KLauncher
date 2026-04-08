import { useEffect, useState } from "react"
// import { addNotification }  from "../../overlay/notification/features/notificationList"
import styles from "../styles/settings.module.css"
import search_icon from "../../../assets/icons/search.svg"

function Settings(): React.JSX.Element {

    const [ installationsFolder, setInstallationsFolder ] = useState<string>();
    const [ modsStashFolder, setModsStashFolder ] = useState<string>();
    const [ modsFolder, setModsFolder ] = useState<string>();
    const [ backupsFolder, setBackupsFolder ] = useState<string>();

    useEffect(() => {
        const getData = async () => {
            setInstallationsFolder(await window.api.getStore('installationsFolder'));
            setModsStashFolder(await window.api.getStore('modsStashFolder'));
            setModsFolder(await window.api.getStore('modsFolder'));
            setBackupsFolder(await window.api.getStore('backupsFolder'));
        };
        getData();
    }, []);

    const selectInstallationsFolder = async () => {
        const res = await window.api.selectFolder();
        if (res != null) {
            await window.api.setStore('installationsFolder', res);
            setInstallationsFolder(res);
        }
    };

    const selectModsStashFolder = async () => {
        const res = await window.api.selectFolder();
        if (res != null) {
            await window.api.setStore('modsStashFolder', res);
            setModsStashFolder(res);
        }
    };

    const selectModsFolder = async () => {
        const res = await window.api.selectFolder();
        if (res != null) {
            await window.api.setStore('modsFolder', res);
            setModsFolder(res);
        }
    };

    const selectBackupsFolder = async () => {
        const res = await window.api.selectFolder();
        if (res != null) {
            await window.api.setStore('backupsFolder', res);
            setBackupsFolder(res);
        }
    };
    

    return (
    <>
        <div className={styles.page_wrapper}>
            <div className={styles.settings_box_wrapper}>
                <div className={styles.settings_theme_box}>
                    <div className={styles.header}>Folders</div>
                    <div className={styles.body}>
                        <div className={styles.setting}>
                            <div className={styles.setting_name}>Installations Folder</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectInstallationsFolder()}}><img src={search_icon} className={styles.img_btn} alt="" /></button>
                                <div className={styles.setting_folder_name}>{installationsFolder}</div>
                            </div>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.setting_name}>Mods Stash Folder</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectModsStashFolder()}}><img src={search_icon} className={styles.img_btn} alt="" /></button>
                                <div className={styles.setting_folder_name}>{modsStashFolder}</div>
                            </div>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.setting_name}>Mods Folder</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectModsFolder()}}><img src={search_icon} className={styles.img_btn} alt="" /></button>
                                <div className={styles.setting_folder_name}>{modsFolder}</div>
                            </div>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.setting_name}>Backups Folder</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectBackupsFolder()}}><img src={search_icon} className={styles.img_btn} alt="" /></button>
                                <div className={styles.setting_folder_name}>{backupsFolder}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Settings