import { useState } from "react";

function PlayButton({installation_id}): React.JSX.Element {

    const [ progress, setProgress ] = useState<number>();
    const [ status, setStatus ] = useState<string>();
    const playButton = async () => {
        const installation = await window.api.getStore(`installations.${installation_id}`);
        // console.log(res);

        const folder = installation.folder;
        const isFolderEmpty = await window.api.isFolderEmpty(folder);
        if (isFolderEmpty) {
            // download exe
            
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
            }
        };
    };

    return (
        <button onClick={playButton}>
            {status ? `Downloading installer: ${progress}%` : "Play"}
        </button>
    )
}

export default PlayButton