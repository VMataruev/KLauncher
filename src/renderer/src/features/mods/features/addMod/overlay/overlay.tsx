import styles from "./overlay.module.css"
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";
import { Download } from "iconoir-react";
import Loader from "@renderer/components/loader/loader";

type OverlayProps = {
  onClose: (e: React.MouseEvent) => void;
  mod: any;
};

type Installation = {
    id: string;
    img: string;
    name: string;
    version: string;
    version_link: string;
    mods: string[];
    folder: string | null;
};

type Release = {
    created: string,
    downloads: number,
    fileid: number,
    filename: string,
    mainfile: string,
    modidstr: string,
    modversion: string,
    releaseid: number
    tags: []
}

function Overlay({onClose, mod}: OverlayProps): React.JSX.Element {
    const [ loading, setLoading ] = useState<boolean>(true);

    const [ installationID, setInstallationID ] = useState<string>("");

    const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
    useEffect(() => {
        const get_installations = async () => {
            const res = await window.api.getStore("installations") as Record<string, Installation>;

            // mod already in installation?
            const installations_filtered: Record<string, Installation> = Object.fromEntries(
                Object.entries(res || {}).filter(([_, installation]) => {
                    return !installation.mods.includes(mod.modid);
                })
            );

            setInstallations(installations_filtered);
            const installationsArray = Object.values(installations_filtered);
            setInstallationID(installationsArray[0].id)
        };
        get_installations();
    }, []);

    const [ releases, setReleases ] = useState<Record<string, Release>>({});
    const [ modName, setModName ] = useState<string>("");
    useEffect(() => {
        const getModReleases = async () => {
            const mod_ = await window.api.getRequest(`https://mods.vintagestory.at/api/mod/${mod.modid}`);
            if (!mod_.success) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // ждем 5 сек
                getModReleases();
                return;
            };
            const releases = mod_.res.mod.releases;
            console.log(releases)
            setReleases(releases);
            setModName(mod_.res.mod.name)
            setLoading(false);
        }
        getModReleases();
    }, [])
    


    const add_mod_to_installation = async (installationID, mod, modID, modLink, modName_, modVersion) => {
        const installation = await window.api.getStore(`installations.${installationID}`);

        const currentMods = installation.mods || [];

        let newMod = ""
        if (mod.logo == null) {
            newMod = {
                ...mod,
                logo: "https://mods.vintagestory.at/web/img/mod-default.png",
                version: modVersion
            }
        } else {
            newMod = {
                ...mod,
                version: modVersion
            }
        }

        await window.api.setStore(
            `installations.${installationID}.mods`,
            [...currentMods, newMod]
        );
        window.api.downloadFile(modLink, `${installation.folder}\\Mods\\${modID}-${modName_}-${modVersion}.zip`);
        const installationName = await window.api.getStore(`installations.${installationID}.name`);
        addNotification({status: "success", msg: `${modName} added to "${installationName}"`})
        onClose({} as React.MouseEvent); // close overlay
    };

    


    return ReactDOM.createPortal(
        <div className={styles.overlay_wrapper} onClick={onClose}>
            <div className={styles.overlay_main_box} onClick={(e) => e.stopPropagation()}>
                <div className={styles.overlay_setting_box}>

                    <div className={styles.overlay_header}>
                        Install mod
                    </div>

                    <div className={styles.overlay_setting_box_name}>Installation</div>
                    <select onChange={(e) => {setInstallationID(e.target.value)}} name="" id="" className={styles.overlay_select}>
                        {Object.values(installations).map(installation => (
                            <option className={styles.overlay_select_option}  value={installation.id} key={installation.id}>{installation.name}</option>
                        ))}
                    </select>
                    <div className={styles.overlay_setting_box_setting}></div>
                </div>

                <div className={styles.overlay_setting_box}>
                    <div className={styles.overlay_setting_box_name}>Mod Versions for {modName}</div>

                    <div className={styles.table_wrapper}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Version</th>
                                    <th>Date</th>
                                    <th>VS versions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(releases).map((release) => (
                                    <tr key={release.modversion}>
                                        <td>{release.modversion}</td>
                                        <td>{new Date(release.created).toLocaleDateString('ru-RU').replace(/\./g, '/')}</td>
                                        <td className={styles.td}>
                                            <div className={styles.tags_scroll}>
                                                {release.tags.map((tag, i) => (
                                                <div key={i}>{tag}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className={styles.download_button} onClick={() => {add_mod_to_installation(installationID, mod, mod.modid, release.mainfile, release.modidstr, release.modversion)}}><Download></Download></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.loader_box}>{loading ? <Loader></Loader> : <></>}</div>

                </div>
            </div>
        </div>,
        document.body
    )
}

export default Overlay