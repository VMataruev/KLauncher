import { useEffect, useState } from "react";
import styles from './playButton.module.css'
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";

function PlayButton({installation_id}): React.JSX.Element {

    const [ versionsFolder, setVersionsFolder ] = useState<string>("");
    const [ modsFolder, setModsFolder ] = useState<string>("");
    useEffect(() => {
        const getFolders = async () => {
            setVersionsFolder(await window.api.getStore('VS_versions'));
            setModsFolder(await window.api.getStore('modsFolder'));
        }
        getFolders();
    }, [])
    
    const [ isPlayButtonInWork, setIsPlayButtonInWork ] = useState<boolean>(false);
    useEffect(() => {
        const unsubscribe = window.api.downloadGameProgress((data) => {
            const percent = data.percent;
            setIsPlayButtonInWork(percent !== 100);
        })
        return () => {
            unsubscribe()
        }
    }, []);

    useEffect(() => {
        const unsubscribe = window.api.extractGameProgress((data) => {
            const percent = data.percent;
            setIsPlayButtonInWork(percent !== 100);
        })
        return () => {
            unsubscribe()
        }
    }, []);
    
    
    // Проверяет папку, докичает версии, перекидывает моды и запускает игру
    const playButton = async () => {
        setIsPlayButtonInWork(true);
        const installation = await window.api.getStore(`installations.${installation_id}`);

        await window.api.clearFolder(modsFolder);
        await window.api.copyFiles(`${installation.folder}\\Mods`, modsFolder);

        const cleanedVersion = installation.version.slice(1);

        let isVersionInstalled = false;
        const isVersionFolderExist = await window.api.hasFolder(versionsFolder, cleanedVersion);
        const isVersionExeExist = await window.api.isFileExist(`${versionsFolder}/{app}/Vintagestory.exe`);
        if (isVersionFolderExist && isVersionExeExist) {isVersionInstalled = true};
        
        if (!isVersionInstalled) {
            // if (isVersionExeExist) {} тут должна распаковываться игра, а не скичаться заново
            await window.api.createFolder(versionsFolder, cleanedVersion);
            // window.api.download_and_install_game(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
            await window.api.downloadGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
            await window.api.extractGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
        };

        const answ = await window.api.gameStart(`${versionsFolder}\\${cleanedVersion}`);
        if (answ.status) {
            addNotification({status: answ.status, msg: answ.msg})
        };

        
        setIsPlayButtonInWork(false);
    };

    return (
        <>
            {/* <button className={`${styles.play_btn} ${styles.play_btn_inactive}`} onClick={playButton}> */}
            <button className={`${styles.play_btn} ${isPlayButtonInWork ? styles.play_btn_in_work : styles.nothing}`} onClick={playButton}>
                {/* {status ? `Downloading installer: ${progress}%` : "PLAY"} */}
                PLAY
            </button>
        </>
    )
}

export default PlayButton