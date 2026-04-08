import { useState } from "react";
import styles from './playButton.module.css'
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";
import axios from "axios";

function PlayButton({installation_id}): React.JSX.Element {

    // Что должна делать кнопка
    // 1. Проверять есть ли что-то в папке
    // Если есть, то искать ехе для запуска игры | НО НЕ ЗАПУСКАТЬ ИГРУ
    // Если нет, то скачивать установщих и запускать его
    // 2. Проверять установлены ли необходимые моды 
    // Если да, то запускать игру
    // Если нет, то искать в папке Mods_Stash или докачивать с moddb
    // 3. Запускать игру


    // Отказ от Mods_Stash
    // 1. Проверять есть ли что-то в папке
    // Если есть, то искать ехе для запуска игры | НО НЕ ЗАПУСКАТЬ ИГРУ
    // Если нет, то скачивать установщих и запускать его
    // 2. Проверять установлены ли необходимые моды 
    // Если да, то запускать игру
    // Если нет, то докачивать с moddb
    // Если есть лишние, то удалить
    // 3. Запускать игру

    const [ isGameInstalled, setIsGameInstalled ] = useState<boolean>(false);
    const[ isRequiredModsInstalled, setIsRequiredModsInstalled ] = useState<boolean>(false);

    const [ progress, setProgress ] = useState<number>();
    const [ status, setStatus ] = useState<string>();
    const playButton = async () => {
        // ==== Получаем настройки установки ====
        const installation = await window.api.getStore(`installations.${installation_id}`);
        console.log(installation);
        // ======================================


        const folder = installation.folder;
        const isFolderEmpty = await window.api.isFolderEmpty(folder);

        // ==== Если папка пустая ====
        if (isFolderEmpty) {
            const unsubscribe = window.api.downloadProgress((data) => {
                setProgress(data.percent);
                setStatus(data.state);
            });

            try {
                await window.api.download_and_install_game(installation.version_link, installation.folder);
            } finally {
                unsubscribe();
                setStatus("");
                setIsGameInstalled(true);
            };
        };
        // ====================

        // ==== Если папка не пустая ====
        if (!isFolderEmpty) {
            // await window.api.open_file(`${installation.folder}\\Vintagestory.exe`);
            const res = await window.api.isFileExist(`${installation.folder}\\Vintagestory.exe`);
            if (res) {
                setIsGameInstalled(true);
            } else {
                addNotification({status: "error", msg: "The directory of installation is already occupied, please delete all files from it."})
            };
        };
        // ==============================




        // ==== Если в установке нет модов ====
        if (installation.mods.length === 0) {
            setIsRequiredModsInstalled(true);
        }
        // ========================================



        // TODO: если моды нужны в установке, то оставляем, если нет, то удаляем

        // ==== Если в установке есть моды ====
        if (installation.mods.length != 0) {
            console.log(installation.mods)
            for (const mod of installation.mods) {
                const res = await window.api.getRequest(`https://mods.vintagestory.at/api/mod/${mod}`);
                const cleanedVerison = installation.version.replace("v", "");
                const neededRelease = res.mod.releases.find((release) =>
                    release.tags.includes(cleanedVerison)
                );

                // console.log(cleanedVerison)
                // console.log(res);
                // console.log(neededRelease);
                const modsPath = await window.api.getStore('modsFolder');
                const fullModsPath = `${modsPath}\\${neededRelease.filename}`
                const linkToMod = `${neededRelease.mainfile}`;
                await window.api.downloadFile(linkToMod, fullModsPath);
            };
            setIsRequiredModsInstalled(true);
        }

        // ====================================

        


        // ==== Если всё ок, то запускаем игру ====
        console.log(isGameInstalled)
        console.log(isRequiredModsInstalled)
        if (isGameInstalled && isRequiredModsInstalled) {
            addNotification({status: "success", msg: "Game started"});
            await window.api.open_file(`${installation.folder}\\Vintagestory.exe`);
        }
        // ========================================
    };

    return (
        <button className={styles.play_btn} onClick={playButton}>
            {status ? `Downloading installer: ${progress}%` : "PLAY"}
        </button>
    )
}

export default PlayButton