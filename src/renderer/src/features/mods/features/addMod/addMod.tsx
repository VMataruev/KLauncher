import { useState } from "react";
import styles from "./addMod.module.css"

function AddModButton({modID}): React.JSX.Element {
    type Installation = {
        id: string;
        img: string;
        name: string;
        version: string;
        version_link: string;
        mods: string[];
        folder: string | null;
    };

    const [ isChooseInstallation, setIsChooseInstallation ] = useState<boolean>(false);
    const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
    const get_installations = async () => {
        const res = await window.api.getStore("installations") as Record<string, Installation>;

        const installations_filtered: Record<string, Installation> = Object.fromEntries(
            Object.entries(res || {}).filter(([_, installation]) => {
                return !installation.mods.includes(modID);
            })
        );

        setInstallations(installations_filtered);
        console.log(installations_filtered);
    };

    const add_mod_to_installation = async (installationID, modID) => {
        const installation = await window.api.getStore(`installations.${installationID}`);

        const currentMods = installation.mods || [];

        await window.api.setStore(
            `installations.${installationID}.mods`,
            [...currentMods, modID]
        );
    };

    return(
        <div className={styles.add_mod_button_box}>
            <button className={styles.add_mod_button} onClick={(e) => {
                e.stopPropagation();
                get_installations();
                setIsChooseInstallation(!isChooseInstallation);
            }}>
                Add
            </button>

            {isChooseInstallation ?
                <select className={styles.button_overlay} onChange={(e) => {
                    setIsChooseInstallation(!isChooseInstallation);
                    add_mod_to_installation(e.target.value, modID)
                    }} onClick={(e) => {e.stopPropagation()}}>
                    <option value="" hidden>Choose installation</option>
                    {Object.values(installations).map(installation => (
                        <option value={installation.id} key={installation.id}>{installation.name}</option>
                    ))}
                </select>
                :
                <></>
            }
        </div>
    )
}

export default AddModButton