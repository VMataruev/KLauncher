import { useState } from "react";
import styles from './playButton.module.css'

function PlayButton({installation_id}): React.JSX.Element {

    const [ progress, setProgress ] = useState<number>();
    const [ status, setStatus ] = useState<string>();
    const playButton = async () => {
        const installation = await window.api.getStore(`installations.${installation_id}`);
        // console.log(res);

        const folder = installation.folder;
        const isFolderEmpty = await window.api.isFolderEmpty(folder);
        if (isFolderEmpty) {
            const unsubscribe = window.api.downloadProgress((data) => {
                setProgress(data.percent);
                setStatus(data.state);
                // console.log(progress);
                // console.log(status);
            });

            try {
                await window.api.download_and_install_game(installation.version_link, installation.folder);
            } finally {
                unsubscribe();
                setStatus("");
            };
            await window.api.open_file(`${installation.folder}\\Vintagestory.exe`);
        };

        if (!isFolderEmpty) {
            try {
                await window.api.open_file(`${installation.folder}\\Vintagestory.exe`);
            } catch (error) {
                console.log("Game not found:", error)
            };
        };
    };

    return (
        <button className={styles.play_btn} onClick={playButton}>
            {status ? `Downloading installer: ${progress}%` : "PLAY"}
        </button>
    )
}

export default PlayButton