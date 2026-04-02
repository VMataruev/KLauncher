import { useEffect, useState } from 'react';
import styles from '../styles/made_installation.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

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

    const [ installationBuild, setInstallationBuild] = useState({
        id: uuidv4(),
        img: "",
        name: "",
        version: "",
        version_link: "",
        mods: [],
        folder: null as string | null
    });

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        const loadData = async (): Promise<void> => {
            const res = await window.api.getData();
            setData(res);
            console.log(res);
            setInstallationBuild((prev) => ({
                ...prev,
                version: res[0].name,
                version_link: res[0].link
            }))
        }
        loadData();
    }, [])
    

    const [ buildStatus, setBuildStatus ] = useState<string>();
    const navigate = useNavigate();

    const storeBuild = async ()  => {
        console.log(installationBuild);
        // if (!installationBuild.img) {
        //     return setBuildStatus("choose img first");
        // };

        if (!installationBuild.name) {
            return setBuildStatus("choose name first");
        };

        if (!installationBuild.version) {
            return setBuildStatus("choose version first");
        };

        if (!installationBuild.version_link) {
            return setBuildStatus("choose version_link first");
        };

        if (!installationBuild.folder) {
            return setBuildStatus("choose folder first");
        };

        await window.api.setStore(`installations.${installationBuild.id}`, installationBuild);
        // const installations = await window.api.getStore("installations");
        // console.log(installations);
        navigate("/installations");
        return setBuildStatus("Installation added");
    };

    const cancel_installation = () => {
        navigate("/installations");
    };
    

    return(
        <div className={styles.page_wrapper}>
            <div className={styles.page_header}>
                <div>Create installation</div>
            </div>

            <div className={styles.page_body}>
                <div className={styles.icon_box}>
                    <select name="" id="">
                        <option value="">Temporal Gear</option>
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

                    <select className={styles.version_input} name="" id="" onChange={(e) => {
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

                {buildStatus ? <div>{buildStatus}</div> : <></>}
                
            </div>

            <div className={styles.page_basement}>
                <button onClick={() => cancel_installation()}>Cancel</button>
                <button onClick={() => storeBuild()}>Install</button>
            </div>
        </div>
    )
}

export default Made_installation