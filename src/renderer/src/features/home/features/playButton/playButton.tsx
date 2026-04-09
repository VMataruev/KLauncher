import { useEffect, useState } from "react";
import styles from './playButton.module.css'
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";

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

    const [ modsPath, setModsPath ] = useState("");
    useEffect(() => {
        const getModsPath = async () => {
            const path = await window.api.getStore("modsFolder");
            setModsPath(path ?? "");
        };
        getModsPath();
    }, []);
    

    const [ isGameInstalled, setIsGameInstalled ] = useState<boolean>(false);
    const [ isRequiredModsInstalled, setIsRequiredModsInstalled ] = useState<boolean>(false);
    const [ isNotRequiredModsUninstalled, setNotRequiredModsUninstalled ] = useState<boolean>(false); // по факту дальше по коду всегда будет ставиться в true, но пусть будет для наглядности

    const [ progress, setProgress ] = useState<number>();
    const [ status, setStatus ] = useState<string>();
    const playButton = async () => {
        // ==== Получаем настройки установки ====
        const installation = await window.api.getStore(`installations.${installation_id}`);
        // console.log(installation);
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


        // ==== Удаляем моды, ненужные для выбранной установки ====  | сверяем имена с именами, которые уже есть в папке с модами, если не нужно, то удаляем
        const files = await window.api.getFilesNames(modsPath);
        // console.log(files);
        for (const file of files) {
            const modID = Number(file.split("-")[0]);
            const modVersion = file.split("-")[1];
            const cleanedVerison = installation.version.replace("v", "");
            if (!installation.mods.includes(modID) || !(modVersion == cleanedVerison)) {
                await window.api.deleteFile(`${modsPath}\\${file}`);
                // console.log(`${modsPath}\\${file}`)
                // TODO: отображение времени удаления файла
            };
        };
        setNotRequiredModsUninstalled(true); // оно всегда будет выполнятся, но пусть будет для наглядности

        // ========================================================


        // TODO: если моды нужны в установке, то оставляем, если нет, то удаляем

        // ==== Если в установке есть моды, то мы их докачиваем в формате modId-verison-name ====
        if (installation.mods.length != 0) {
            // console.log(installation.mods)
            for (const mod of installation.mods) {
                const res = await window.api.getRequest(`https://mods.vintagestory.at/api/mod/${mod}`);
                const cleanedVerison = installation.version.replace("v", "");
                const neededRelease = res.mod.releases.find((release) =>
                    release.tags.includes(cleanedVerison)
                );

                // console.log(cleanedVerison)
                // console.log(res);
                // console.log(res);

                // const fullModsPath = `${modsPath}\\${mod}-${neededRelease.filename}`
                const fullModsPath = `${modsPath}\\${mod}-${cleanedVerison}-${neededRelease.modidstr}.zip`
                const linkToMod = `${neededRelease.mainfile}`;
                await window.api.downloadFile(linkToMod, fullModsPath);
                // TODO: добавить отображение загрузки и заблокировать кнопку игры до завершения скачивания
            };
            setIsRequiredModsInstalled(true);
        }

        // ====================================

        


        // ==== Если всё ок, то запускаем игру ====
        console.log(isGameInstalled);
        console.log(isRequiredModsInstalled);
        console.log(isNotRequiredModsUninstalled);
        if (isGameInstalled && isRequiredModsInstalled && isNotRequiredModsUninstalled) {
            addNotification({status: "success", msg: "Game started"});
            await window.api.open_file(`${installation.folder}\\Vintagestory.exe`);
        }
        // ========================================
    };

    return (
        <>
            <button className={styles.play_btn} onClick={playButton}>
                {status ? `Downloading installer: ${progress}%` : "PLAY"}
            </button>
        </>
    )
}

export default PlayButton