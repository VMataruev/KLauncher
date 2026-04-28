import { useEffect, useState } from "react"
// import { addNotification }  from "../../overlay/notification/features/notificationList"
import styles from "../styles/settings.module.css"
// import search_icon from "../../../assets/icons/search.svg"
import { Search } from "iconoir-react";

function Settings(): React.JSX.Element {

    const [ installationsFolder, setInstallationsFolder ] = useState<string>();
    const [ vsVersionsFolder, setVsVersionsFolder ] = useState<string>();
    const [ modsFolder, setModsFolder ] = useState<string>();
    const [ backupsFolder, setBackupsFolder ] = useState<string>();

    useEffect(() => {
        const getData = async () => {
            setInstallationsFolder(await window.api.getStore('installationsFolder'));
            setVsVersionsFolder(await window.api.getStore('VS_versions'));
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

    const selectVS_versions = async () => {
        const res = await window.api.selectFolder();
        if (res != null) {
            await window.api.setStore('VS_versions', res);
            setVsVersionsFolder(res);
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
                            <div className={styles.setting_name}>Installations</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectInstallationsFolder()}}><Search className={styles.img_btn}></Search></button>
                                <div className={styles.setting_folder_name}>{installationsFolder}</div>
                            </div>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.setting_name}>VS Versions</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectVS_versions()}}><Search className={styles.img_btn}></Search></button>
                                <div className={styles.setting_folder_name}>{vsVersionsFolder}</div>
                            </div>
                        </div>

                        {/* Может и не надо это делать, а просто оставить дефолтно */}
                        <div className={styles.setting}>
                            <div className={styles.setting_name}>Mods</div>   
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectModsFolder()}}><Search className={styles.img_btn}></Search></button>
                                <div className={styles.setting_folder_name}>{modsFolder}</div>
                            </div>
                        </div>

                        <div className={styles.setting}>
                            <div className={styles.setting_name}>Backups</div>
                            <div className={styles.fromname_pading}>
                                <button className={styles.setting_folder_btn} onClick={() => {selectBackupsFolder()}}><Search className={styles.img_btn}></Search></button>
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