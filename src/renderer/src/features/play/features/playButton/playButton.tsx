import { useEffect, useState } from "react";
import styles from './playButton.module.css'
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";

function PlayButton(): React.JSX.Element {

    const [ versionsFolder, setVersionsFolder ] = useState<string>("");
    const [ modsFolder, setModsFolder ] = useState<string>("");
    useEffect(() => {
        const getFolders = async () => {
            setVersionsFolder(await window.api.getStore('VS_versions'));
            setModsFolder(await window.api.getStore('modsFolder'));
        }
        getFolders();
    }, [])
    
    const [ buttonProcess, setButtonProcess ] = useState<"idle" | "downloading" | "extracting">("idle");
    useEffect(() => {
        const unsubscribe = window.api.downloadGameProgress((data) => {
            setButtonProcess(data.percent === 100 ? "extracting" : "downloading");
        })
        return () => {
            unsubscribe()
        }
    }, []);

    useEffect(() => {
        const unsubscribe = window.api.extractGameProgress((data) => {
            setButtonProcess(data.percent === 100 ? "idle" : "extracting");
        })
        return () => {
            unsubscribe()
        }
    }, []);
    
    
    // Проверяет папку, докичает версии, перекидывает моды и запускает игру
    const playButton = async () => {
        setButtonProcess('downloading');
        const installation_to_start = await window.api.getStore('installation_to_start');
        const installation = await window.api.getStore(`installations.${installation_to_start}`);
        if (!installation) {
            addNotification({
                status: "error",
                msg: "Installation not found"
            });
            setButtonProcess("idle");
            return;
        }

        await window.api.clearFolder(modsFolder);
        await window.api.copyFiles(`${installation.folder}\\Mods`, modsFolder);

        const cleanedVersion = installation.version.slice(1);

        const isVersionFolderExist = await window.api.hasFolder(versionsFolder, cleanedVersion);
        const installationName = installation.version_link.split('/').pop();
        const isInstallationExeExist = await window.api.isFileExist(`${versionsFolder}\\${cleanedVersion}\\${installationName}`);
        const isAppFolderExist = await window.api.hasFolder(`${versionsFolder}\\${cleanedVersion}`, 'app');
        // const isVersionExeExist = await window.api.isFileExist(`${versionsFolder}\\${cleanedVersion}\\app\\Vintagestory.exe`);


        if (!isVersionFolderExist) {
            await window.api.createFolder(versionsFolder, cleanedVersion);
            await window.api.downloadGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
            await window.api.extractGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
        };

        if (isVersionFolderExist && !isInstallationExeExist && !isAppFolderExist) { // если есть игра, то нет смысла качать инсталятор ещё раз. Хз в каким случае такое может случиться, но пусть будет
            await window.api.downloadGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
            await window.api.extractGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
        };

        if (isVersionFolderExist && isInstallationExeExist && !isAppFolderExist) {
            await window.api.extractGame(installation.version_link, `${versionsFolder}\\${cleanedVersion}`);
        };
        

        const answ = await window.api.gameStart(`${versionsFolder}\\${cleanedVersion}\\app`, installation_to_start);
        if (answ.status) {
            addNotification({status: answ.status, msg: answ.msg})
        };

        
        setButtonProcess('idle');
    };

    return (
        <>
            {/* <button className={`${styles.play_btn} ${styles.play_btn_inactive}`} onClick={playButton}> */}
            <button className={`${styles.play_btn} ${buttonProcess != 'idle' ? styles.play_btn_in_work : styles.nothing}`} onClick={playButton}>
                {/* {status ? `Downloading installer: ${progress}%` : "PLAY"} */}
                PLAY
            </button>
        </>
    )
}

export default PlayButton