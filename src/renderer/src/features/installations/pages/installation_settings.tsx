import { useEffect, useState } from 'react';
import styles from '../styles/installation_settings.module.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import { addNotification } from '@renderer/features/overlay/notification/features/notificationList';
import CustomSelect from '@renderer/components/CustomSelect/CustomSelect';
import iconOptions from '@renderer/components/Installation_icons';
import { Search } from 'iconoir-react';
import Loader from '@renderer/components/loader/loader';
import { OpenNewWindow } from 'iconoir-react';

function Installation_settings(): React.JSX.Element {
    const [ isUserStatusLoading, setIsUserStatusLoading ] = useState<boolean>(true);
    const [ isUserLogged, setIsUserLogged ] = useState<boolean>(false);
    
    const { id } = useParams();
    const installationID = id;

    // const [ installationBuild, setInstallationBuild ] = useState<any>({
    //     id: "",
    //     img: "",
    //     name: "",
    //     version: "",
    //     version_link: "",
    //     mods: [],
    //     folder: ""
    // });

    const [ installationBuild, setInstallationBuild ] = useState<any>();

    const [ oldPath, setOldPath ] = useState("");
    const [ _oldVersion, setOldVersion ] = useState("");

    const [ modsLoader, setModsLoader ] = useState<boolean>(true);
    useEffect(() => {
        const getInstallationData = async () => {
            const data = await window.api.getStore(`installations.${installationID}`);
            setInstallationBuild(data);
            setOldPath(data.folder);
            setOldVersion(data.version);
            setModsLoader(false);
        };
        getInstallationData();
    }, [])

    // console.log(installationBuild)
    // console.log(installationBuild.version)
    
    
    const [ _folderPath, setFolderPath ] = useState<string>();
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

    

    // get all versions
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
            const versions_unstable = res.versions_unstable;
            const combinedVersions = [...versions_stable, ...versions_unstable];
            setData(combinedVersions);
            // console.log(res);
            // setInstallationBuild((prev) => ({
            //     ...prev,
            //     version: res[0].name,
            //     version_link: res[0].link
            // }))
        }
        loadData();
    }, [])

    const [ modsToDelete, setModsToDelete ] = useState<number[]>([]);
    const deleteMod = async (targetModID) => {
        const updatedMods = installationBuild.mods.filter((mod: any) => mod.modid !== targetModID);
        // await window.api.setStore(`installations.${installationBuild.id}.mods`, updatedMods);
        setInstallationBuild((prev) => ({
            ...prev,
            mods: updatedMods
        }));

        setModsToDelete((prev) => (
            prev.includes(targetModID) ? prev : [...prev, targetModID]
        ));
    };


    const [ selectedIcon, setSelectedIcon ] = useState("");
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
        // if (!installationBuild.img) {
        //     return setBuildStatus("choose img first");
        // };

        // if (!installationBuild.name) {
        //     return setBuildStatus("choose name first");
        // };

        // if (!installationBuild.version) {
        //     return setBuildStatus("choose version first");
        // };

        // if (!installationBuild.version_link) {
        //     return setBuildStatus("choose version_link first");
        // };

        // if (!installationBuild.folder) {
        //     return setBuildStatus("choose folder first");
        // };

        if (installationBuild.name.length < 3) {
            return addNotification({status: "warning", msg: "Installation name can't be less then 3 symbols"})
        };

        if (installationBuild.name.length > 50) {
            return addNotification({status: "warning", msg: "Installation name can't be more then 50 symbols"})
        }



        // Clear folder path and name ======================
        const sanitizeFolderName = (name: string): string => {
            return name
                .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // запрещённые символы Windows
                .replace(/\s+/g, ' ')                  // много пробелов -> один
                .trim()                                // убрать пробелы по краям
                .replace(/\.+$/, '');                  // убрать точки в конце
        };
        const finalName = sanitizeFolderName(installationBuild.name)
        // const finalPath = `${installationBuild.folder}\\${finalName}`

        const parentPath = oldPath.split("\\").slice(0, -1).join("\\");
        const newPath = `${parentPath}\\${finalName}`;

        if (installationBuild.folder != null) {
            await window.api.renameFolder(oldPath, newPath);
        }

        const updatedInstallationBuild = {
            ...installationBuild,
            folder: newPath
        };
        // ================================================


        // If name already exist (used finalName from previous check) ======================
        const installations = await window.api.getStore("installations") as Record<string, Installation>;
        const isNameExists = Object.values(installations).some(
            (installation) => 
                installation.name === finalName &&
                installation.id !== installationBuild.id
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


        // ========== delete mods ==========
        const pathToInstallation = await window.api.getStore(`installations.${installationID}.folder`);
        const pathToMods = `${pathToInstallation}\\Mods`;
        const files = await window.api.getFilesNames(pathToMods)
        for (const file of files) {
            const modID = Number(file.split("-")[0]);
            if (modsToDelete.includes(modID)) {
                await window.api.deleteFile(`${pathToMods}\\${file}`);
            };
        };
        // ==================================


        navigate("/installations");
        return setBuildStatus("Installation added");
    };

    const cancel_installation = () => {
        navigate("/installations");
    };




    const exportMods = async () => {
        await navigator.clipboard.writeText(JSON.stringify(installationBuild.mods))
        addNotification({status: "success", msg: "Mods copied to clipboard"})
    };

    const [ isOverlayImportOpen, setIsOverlayImportOpen ] = useState<boolean>(false);
    const openModsImportOverlay = () => {
        setIsOverlayImportOpen(!isOverlayImportOpen);
    }

    const [ importedModsRaw, setImportedModsRaw ] = useState<string>("")
    // const [ importedMods, setImportedMods ] = useState([]);
    const [ isModsLoading, setIsModsLoading ] = useState<boolean>(false);
    // TODO: сделать, чтобы кнопка не работало на время всей скачки, а не каждого отдельного файла
    // useEffect(() => {
    //     const unsubscribe = window.api.downloadFileProgress((data) => {
    //         setIsModsLoading(data.percent === 100 ? false : true);
    //     })
    //     return () => {
    //         unsubscribe()
    //     }
    // }, []);

    const importMods = async () => {
        setIsModsLoading(true);
        openModsImportOverlay();
        addNotification({status: "success", msg: `Mods added to ${installationBuild.name}`});
        let modList = JSON.parse(importedModsRaw);
        for (let mod of modList) {
            const installation = await window.api.getStore(`installations.${installationID}`)
            const modExists = installation.mods?.some(existingMod => existingMod.modid === mod.modid);
            if (!modExists) {
                const mod_ = await window.api.getRequest(`https://mods.vintagestory.at/api/mod/${mod.modid}`);
                if (!mod_.success) {
                    addNotification({status: "error", msg: `Something went wrong for ${mod.name}`});
                };

                const releases = mod_.res.mod.releases;
                for (let release of releases) {
                    if (release.modversion == mod.version) {
                        const installation = await window.api.getStore(`installations.${installationID}`)
                        const currentMods = installation.mods || [];
                        await window.api.setStore(
                            `installations.${installation.id}.mods`,
                            [...currentMods, mod]
                        );
                        await window.api.downloadFile(release.mainfile, `${installationBuild.folder}\\Mods\\${mod.modid}-${release.modidstr}-${release.modversion}.zip`);
                    }
                }
                const buildWithImportedMods = await window.api.getStore(`installations.${installationID}`);
                setInstallationBuild(buildWithImportedMods);
            }
        }
        setIsModsLoading(false);
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
                                        placeholder={installationBuild?.name}
                                        value={installationBuild?.name}/>
                                        <div className={styles.name_muted}>From 5 to 50 symbols</div>
                                    </div>
                                </div>

                                <div className={styles.icon_box}>
                                    <CustomSelect value={installationBuild?.img} onChange={(id) => {
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
                                    <select className={`${styles.version_input} ${styles.input}`} name="" id="" value={installationBuild?.version || ""} onChange={(e) => {
                                        const select = e.target;
                                        const option = select.options[select.selectedIndex];
                                        const link = option.getAttribute('data-link');
                                        
                                        setInstallationBuild((prev) => ({
                                        ...prev,
                                        version: e.target.value,
                                        version_link: link || ""
                                    }))}}>

                                        {data ? data.map((version) => (
                                            <option key={version.name} data-link={version.link} value={version.name}>{version.name}</option>
                                        )) : <></>}
                                    </select>
                                }
                            </div>

                            <div className={styles.setting_box}>
                                <div className={styles.setting_name}>Mods</div>
                                <div className={styles.mods_box}>
                                    {modsLoader ? <div className={`${styles.input}`}><Loader fontSize="18px"></Loader></div> :
                                    <div className={`${styles.input} ${styles.input_mods}`}>
                                        <div className={styles.mods_grid}>
                                        {installationBuild.mods.length == 0 ? <div>No mods</div> :
                                            installationBuild.mods.map(mod => (
                                                <div className={styles.mod_box}>
                                                    <img className={styles.mod_img} src={mod.logo} alt="" />
                                                    <Link className={styles.link_to_mod} to={`/mod/${mod.modid}`}><OpenNewWindow></OpenNewWindow></Link>
                                                    <div className={styles.mod_basement}>
                                                        <div className={styles.mod_name}>{mod.name}</div>
                                                        <div className={styles.mod_version}>{mod.version}</div>
                                                        <button onClick={() => {deleteMod(mod.modid)}} className={styles.mod_delete_btn}>Delete</button>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        </div>
                                    </div>
                                    }
                                </div>
                            </div>

                            {modsLoader ? <></> : 
                                <div className={styles.mods_export_import_btns_box}>
                                    <div className={styles.mod_export_import_btn} onClick={() => {openModsImportOverlay()}}>Import</div>
                                    {installationBuild.mods.length == 0 ? <></> :
                                    <div className={styles.mod_export_import_btn} onClick={() => {exportMods()}}>Export</div>
                                    }
                                </div>
                            }

                            

                            <div className={styles.setting_box}>
                                <div className={styles.setting_name}>Installation Folder</div>
                                <div className={styles.folder_box}>
                                    <Search onClick={handleSelectFolder} className={styles.folder_btn}></Search>
                                    <div className={styles.foler_box_change}>
                                        <div className={`${styles.folder_name} ${styles.input}`}>{installationBuild?.folder}</div>
                                    </div>
                                </div>
                            </div>

                            {buildStatus ? <div>{buildStatus}</div> : <></>}
                        </div>
                    
                </div>

                <div className={styles.page_basement}>
                    <div className={styles.basement_btns_box}>
                        <button className={styles.basement_btn} onClick={() => cancel_installation()}>Cancel</button>
                        {isModsLoading ?  
                            <button className={`${styles.basement_btn} ${styles.basement_btn_main}`}><Loader fontSize="18px"></Loader></button>
                        : 
                            <button className={`${styles.basement_btn} ${styles.basement_btn_main}`} onClick={() => storeBuild()}>Save</button>
                        }
                    </div>
                </div>


                
            </div>

            {!isOverlayImportOpen ? <></> : 
                <div className={styles.mod_export_import_overlay} onClick={() => {openModsImportOverlay()}}>
                    <div className={styles.mod_export_import_overlay_box} onClick={(e) => {e.stopPropagation()}}>
                        <div className={styles.mod_export_import_overlay_header}>Insert exported mods</div>
                        <textarea onChange={(e) => {setImportedModsRaw(e.target.value)}} className={styles.mod_export_import_overlay_input} />
                        <div className={styles.mod_export_import_overlay_btns_box}>
                            <div className={styles.mod_export_import_overlay_btn} onClick={() => {openModsImportOverlay()}}>Cancel</div>
                            <div className={styles.mod_export_import_overlay_btn_primary} onClick={() => {importMods()}}>Submit</div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Installation_settings