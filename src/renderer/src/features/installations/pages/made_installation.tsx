import { useEffect, useState } from 'react';
import styles from '../styles/made_installation.module.css'

function Made_installation(): React.JSX.Element {
    
    const [ folderPath, setFolderPath ] = useState<string | null>(null);
    const handleSelectFolder = async () => {
        try {
            const selectedPath = await window.api.selectFolder();
            setFolderPath(selectedPath);
            setInstallationBuild((prev) => ({
                ...prev,
                folder: selectedPath
            }));

        } catch (error) {
            console.log('Cant select foler', error);
        }
    };

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        const loadData = async (): Promise<void> => {
            const res = await window.api.getData();
            setData(res);
            console.log(res);
        }
        loadData();
    }, [])

    const [ installationBuild, setInstallationBuild] = useState({
        img: "",
        name: "",
        version: "",
        version_link: "",
        mods: [],
        folder: null as string | null
    });

    const test = () => {
        console.log(installationBuild);
    }
    

    return(
        <div className={styles.page_wrapper}>
            <div className={styles.page_header}>
                <div>Installation create</div>
            </div>
            <button onClick={() => test()}>test</button>

            <div className={styles.page_body}>
                <div className={styles.icon_box}>
                    <select name="" id="">
                        <option value="">Temporal Gear</option>
                    </select>
                </div>

                <div className={styles.name_box}>
                    <div className={styles.name}>Name</div>
                    <input type="text" onChange={(e) => {setInstallationBuild((prev) => ({
                        ...prev,
                        name: e.target.value
                    }))}} />
                </div>
                
                <div className={styles.version_box}>
                    <div className={styles.version}>Version</div>

                    <select name="" id="" onChange={(e) => {
                        const select = e.target;
                        const option = select.options[select.selectedIndex];
                        const link = option.getAttribute('data-link');
                        
                        setInstallationBuild((prev) => ({
                        ...prev,
                        version: e.target.value,
                        version_link: link || ""
                    }))}}>

                        {data ? data.map((version) => (
                            <option key={version.name} data-link={version.link}>{version.name}</option>
                        )) : <></>}
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