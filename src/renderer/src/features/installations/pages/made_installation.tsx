import { useEffect, useState } from 'react';
import styles from '../styles/made_installation.module.css'

function Made_installation(): React.JSX.Element {
    
    const [ folderPath, setFolderPath ] = useState<string | null>(null);
    const handleSelectFolder = async () => {
        try {
            const selectedPath = await window.api.selectFolder();
            setFolderPath(selectedPath);

        } catch (error) {
            console.log('Cant select foler', error);
        }
    }

    // Загрузка версий при монтировании компонента
    useEffect(() => {
        const loadVersions = async () => {
            const result = await window.api.getVersions();
            // console.log('Versions loaded:', result);
    };

        loadVersions();
    }, []); // Пустой массив зависимостей = выполнить один раз при монтировании

    return(
        <div className={styles.page_wrapper}>
            <div className={styles.page_header}>
                <div>Installation create</div>
            </div>

            <div className={styles.page_body}>
                <div className={styles.icon_box}>
                    <select name="" id="">
                        <option value="">img</option>
                    </select>
                </div>

                <div className={styles.name_box}>
                    <div className={styles.name}>Name</div>
                    <input type="text" />
                </div>
                
                <div className={styles.version_box}>
                    <div className={styles.version}>Version</div>
                    <select name="" id="">
                        <option value="">version</option>
                    </select>
                </div>

                <div className={styles.mods_box}>
                    <div>mods</div>
                </div>

                <div className={styles.foler_box}>
                    <div className={styles.foler_header}>Foler</div>
                    <div className={styles.foler_box_change}>
                        <div className={styles.foler_name}>{folderPath ? folderPath : 'Default'}</div>
                        <button onClick={handleSelectFolder}>Observe</button>
                    </div>
                </div>
                
            </div>

            <div className={styles.page_basement}>
                <button>Cancel</button>
                <button>Install</button>
            </div>
        </div>
    )
}

export default Made_installation