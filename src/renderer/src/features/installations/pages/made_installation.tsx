import { useEffect, useState } from 'react';
import styles from '../styles/made_installation.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { addNotification } from '@renderer/features/overlay/notification/features/notificationList';
import CustomSelect from '@renderer/components/CustomSelect/CustomSelect';
import iconOptions from '@renderer/components/Installation_icons';
import { Search } from "iconoir-react";
import Loader from '@renderer/components/loader/loader';

function Made_installation(): React.JSX.Element {
    const [ isUserStatusLoading, setIsUserStatusLoading ] = useState<boolean>(true);
    const [ isUserLogged, setIsUserLogged ] = useState<boolean>(false);
    const [ installationVersion, setInstallationVersion ] = useState<string>("");
    const [ showStableVersions, setShowStableVersions ] = useState<boolean>(true);
    const [ showUnstableVersions, setShowUnstableVersions ] = useState<boolean>(false);
    const [ stableVersions, setStableVersions ] = useState([]);
    const [ unstableVersions, setUnstableVersions ] = useState([]);
    
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
        folder: null as string | null,
        time_played: 0
    });

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        const loadData = async (): Promise<void> => {
            const res = await window.api.getData();
            if (res.status == "ok") {
                setIsUserStatusLoading(false);
                setIsUserLogged(true);
            } else {
                setIsUserStatusLoading(false);
            }
            const versions_stable = res.versions_stable;
            for (const version_stable of versions_stable) {
                version_stable.type = "stable";
            }
            setStableVersions(versions_stable);
            const versions_unstable = res.versions_unstable;
            for (const version_unstable of versions_unstable) {
                version_unstable.type = "unstable";
            }
            setUnstableVersions(versions_unstable);

            const sortedVersion = versions_stable.sort((a, b) => {
                // Удаляем 'v' из начала и сравниваем
                const versionA = a.name.replace('v', '');
                const versionB = b.name.replace('v', '');
                return versionB.localeCompare(versionA, undefined, { numeric: true });
            });
            setData(sortedVersion);
            setInstallationBuild((prev) => ({
                ...prev,
                version: versions_stable[0].name,
                version_link: versions_stable[0].link
            }));
            setInstallationVersion(versions_stable[0].name);
        }
        loadData();
    }, [])

    useEffect(() => {
        let versionsToShow = data;
        if (showStableVersions && !showUnstableVersions) {
            versionsToShow = [...stableVersions]
        } else if (!showStableVersions && showUnstableVersions) {
            versionsToShow = [...unstableVersions]
        } else if (showStableVersions && showUnstableVersions) {
            versionsToShow = [...stableVersions, ...unstableVersions]
        } else if (!showStableVersions && !showUnstableVersions) {
            versionsToShow = []
        }
        const sortedVersion = versionsToShow.sort((a, b) => {
            // Удаляем 'v' из начала и сравниваем
            const versionA = a.name.replace('v', '');
            const versionB = b.name.replace('v', '');
            return versionB.localeCompare(versionA, undefined, { numeric: true });
        });
        setData(sortedVersion);
    }, [showStableVersions, showUnstableVersions])
    



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
            return addNotification({status: "warning", msg: "Choose image first"})
        };

        if (!installationBuild.name) {
            return addNotification({status: "warning", msg: "Choose name first"})
        };

        if (installationBuild.name.length < 3) {
            return addNotification({status: "warning", msg: "Installation name can't be less then 3 symbols"})
        };

        if (installationBuild.name.length > 50) {
            return addNotification({status: "warning", msg: "Installation name can't be more then 50 symbols"})
        }

        if (!installationBuild.version) {
            return addNotification({status: "warning", msg: "Choose version first"})
        };

        if (!installationBuild.version_link) {
            return addNotification({status: "warning", msg: "Choose version_link first"})
        };

        if (!installationBuild.folder) {
            return addNotification({status: "warning", msg: "Choose folder first"})
        };



        // Clear folder path and name ======================
        const sanitizeFolderName = (name: string): string => {
            return name
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // запрещённые символы Windows
                .replace(/\s+/g, ' ')                  // много пробелов -> один
                .trim()                                // убрать пробелы по краям
                .replace(/\.+$/, '');                  // убрать точки в конце
        };
        const finalName = sanitizeFolderName(installationBuild.name);
        const finalPath = `${installationBuild.folder}\\${finalName}`;
        await window.api.createFolder(installationBuild.folder, finalName);
        const updatedInstallationBuild = {
            ...installationBuild,
            folder: finalPath
        };

        await window.api.createFolder(finalPath, "Mods");
        // ================================================


        // If name already exist (used finalName from previous check) ======================
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

    const setVersion = (version) => {
        setInstallationBuild((prev) => ({
            ...prev,
            version: version.name,
            version_link: version.link
        }));
        setInstallationVersion(version.name);
    };

    
    return(
        <>
            <div className={styles.page_wrapper}>
                
                <div className={styles.settings_box}>
                    <div className={styles.header}>
                        <div>Basics</div>
                    </div>

                    <div className={styles.page_body_box}>
                        <div className={styles.name_box}>
                            <div className={styles.setting_box}>
                                <div className={styles.setting_name}>Name</div>
                                <div className={styles.input_box_name}>
                                    <input type="text" className={styles.input} onChange={(e) => {setInstallationBuild((prev) => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}} 
                                    placeholder='No name'/>
                                    <div className={styles.name_muted}>From 3 to 50 symbols</div>
                                </div>
                            </div>

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
                        </div>
                        
                        <div className={styles.setting_box}>
                            <div className={styles.setting_name}>Version</div>
                            {isUserStatusLoading ? <Loader fontSize="18px"></Loader> : 
                                !isUserLogged ? <div className={styles.loginbox}>Please Log In to see game versions</div> :
                                <div className={styles.input}>
                                    <div className={styles.versions_wrapper}>
                                        <div className={styles.versions_header}>
                                            <div className={styles.header_left_box}>Filters</div>
                                            <div className={styles.header_right_box}>
                                                <div className={styles.version_info}>Version</div>
                                                <div className={styles.version_info}>Type</div>
                                            </div>
                                        </div>
                                        <div className={styles.versions_box}>
                                            <div className={styles.versions_filter_wrapper}>
                                                <div className={styles.versions_filter}>
                                                    <input className={styles.versions_filter_checkbox} onChange={() => {setShowStableVersions(!showStableVersions)}} type="checkbox" defaultChecked />
                                                    <div className={styles.versions_filter_name}>Stable</div>
                                                </div>
                                                <div className={styles.versions_filter}>
                                                    <input className={styles.versions_filter_checkbox} onChange={() => {setShowUnstableVersions(!showUnstableVersions)}} type="checkbox" />
                                                    <div className={styles.versions_filter_name}>Unstable</div>
                                                </div>
                                            </div>
                                            <div className={styles.versions}>
                                                {data ? data.map((version) => (
                                                    <div className={`${installationVersion == version.name ? styles.installationVersion : styles.version}`} onClick={() => {setVersion(version)}}>
                                                        <div className={styles.version_info}>{version.name}</div>
                                                        <div className={styles.version_info}>{version.type == "stable" ? <>stable</> : <>unstable</>}</div>
                                                    </div>
                                                )) : <></>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        

                        <div className={styles.setting_box}>
                            <div className={styles.setting_name}>Installation Folder</div>
                            <div className={styles.folder_box}>
                                <Search onClick={handleSelectFolder} className={styles.folder_btn}></Search>
                                <div className={styles.foler_box_change}>
                                    <div className={`${styles.folder_name} ${styles.input}`}>{folderPath ? folderPath : 'Default'}</div>
                                </div>
                            </div>
                        </div>

                        {buildStatus ? <div>{buildStatus}</div> : <></>}
                    </div>
                </div>
                

                <div className={styles.page_basement}>
                    <div className={styles.basement_btns_box}>
                        <button className={styles.basement_btn} onClick={() => cancel_installation()}>Cancel</button>
                        <button className={`${styles.basement_btn} ${styles.basement_btn_main}`} onClick={() => storeBuild()}>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Made_installation