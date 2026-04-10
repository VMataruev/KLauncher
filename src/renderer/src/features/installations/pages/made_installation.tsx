import { useEffect, useState } from 'react';
import styles from '../styles/made_installation.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { addNotification } from '@renderer/features/overlay/notification/features/notificationList';
import CustomSelect from '@renderer/components/CustomSelect/CustomSelect';
import iconOptions from '@renderer/components/Installation_icons';

function Made_installation(): React.JSX.Element {
    
    const [ folderPath, setFolderPath ] = useState<string>();
    useEffect(() => {
        const getDefaultFolder = async () => {
            const res = await window.api.getStore('installationsFolder');
            if (res != null) {
                setFolderPath(res);
                setInstallationBuild((prev) => ({
                    ...prev,
                    folder: res
                }));
            };
        };
        getDefaultFolder();
    }, [])
    
    const handleSelectFolder = async () => {
        try {
            const selectedPath = await window.api.selectFolder();
            if (selectedPath != null) {
                setFolderPath(selectedPath);
                setInstallationBuild((prev) => ({
                    ...prev,
                    folder: selectedPath
                }));
            };
        } catch (error) {
            console.log('Cant select foler', error);
        }
    };

    const [ installationBuild, setInstallationBuild ] = useState({
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
            // console.log(res);
            setInstallationBuild((prev) => ({
                ...prev,
                version: res[0].name,
                version_link: res[0].link
            }))
        }
        loadData();
    }, [])



    const [ selectedIcon, setSelectedIcon ] = useState("gear-temporal");
    useEffect(() => {
        setInstallationBuild((prev) => ({
            ...prev,
            img: selectedIcon
        }))
    }, [selectedIcon])
        
    

    const [ buildStatus, setBuildStatus ] = useState<string>();
    const navigate = useNavigate();

    const storeBuild = async ()  => {
        // console.log(installationBuild);
        if (!installationBuild.img) {
            return setBuildStatus("choose img first");
        };

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



        // Clear folder path and name ======================
        const sanitizeFolderName = (name: string): string => {
            return name
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // запрещённые символы Windows
                .replace(/\s+/g, ' ')                  // много пробелов -> один
                .trim()                                // убрать пробелы по краям
                .replace(/\.+$/, '');                  // убрать точки в конце
        };
        const finalName = sanitizeFolderName(installationBuild.name)
        const finalPath = `${installationBuild.folder}\\${finalName}`
        await window.api.createFolder(installationBuild.folder, finalName);
        const updatedInstallationBuild = {
            ...installationBuild,
            folder: finalPath
        };
        // ================================================


        // If name already exist (used finalName from previous check) ======================
        type Installation = {
            id: string;
            img: string;
            name: string;
            version: string;
            version_link: string;
            mods: string[];
            folder: string | null;
        };
        const installations = await window.api.getStore("installations") as Record<string, Installation>;
        const isNameExists = Object.values(installations).some(
            (installation) => installation.name === finalName
        );

        if (isNameExists) {
            addNotification({
                status: "error",
                msg: "Installation with this name already exist"
            });
            return setBuildStatus("Change installation name");
        }
        // ============================================



        await window.api.setStore(`installations.${updatedInstallationBuild.id}`, updatedInstallationBuild);
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
                <div className={styles.page_body_box}>
                    <div className={styles.icon_box}>
                        <CustomSelect value={selectedIcon} onChange={(id) => {
                            const selected = iconOptions.find(i => i.id === id);
                            if (!selected) return;

                            setSelectedIcon(id);
                            setInstallationBuild(prev => ({
                                ...prev,
                                img: selected.icon // сохраняем путь, а не id
                            }));
                        }} options={iconOptions}></CustomSelect>
                    </div>

                    <div className={styles.name_box}>
                        <div className={styles.name}>Name</div>
                        <input type="text" className={styles.input} onChange={(e) => {setInstallationBuild((prev) => ({
                            ...prev,
                            name: e.target.value
                        }))}} 
                        placeholder='No name'/>
                    </div>
                    
                    <div className={styles.version_box}>
                        <div className={styles.version}>Version</div>

                        <select className={`${styles.version_input} ${styles.input}`} name="" id="" onChange={(e) => {
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

                    

                    <div className={styles.foler_box}>
                        <div className={styles.foler_header}>Game's Folder</div>
                        <div className={styles.foler_box_change}>
                            <div className={`${styles.folder_name} ${styles.input}`}>{folderPath ? folderPath : 'Default'}</div>
                            <button onClick={handleSelectFolder} className={styles.folder_btn}>Observe</button>
                        </div>
                    </div>

                    {buildStatus ? <div>{buildStatus}</div> : <></>}
                </div>
            </div>

            <div className={styles.page_basement}>
                <div className={styles.basement_btns_box}>
                    <button className={styles.basement_btn} onClick={() => cancel_installation()}>Cancel</button>
                    <button className={`${styles.basement_btn} ${styles.basement_btn_main}`} onClick={() => storeBuild()}>Install</button>
                </div>
            </div>
        </div>
    )
}

export default Made_installation