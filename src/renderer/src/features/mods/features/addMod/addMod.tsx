import { useState } from "react";
import styles from "./addMod.module.css"

function AddModButton({modID, modName, modLink}): React.JSX.Element {
    const modInfo = {
        modId: modID,
        modName: modName,
        modLink: modLink
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

    const [ isChooseInstallation, setIsChooseInstallation ] = useState<boolean>(false);
    const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
    const add_mod_to_installation = async () => {
        const res = await window.api.getStore('installations');
        setInstallations(res);
        console.log(res);
    }
    return(
        <div className={styles.add_mod_button_box}>
            <button className={styles.add_mod_button} onClick={(e) => {
                e.stopPropagation();
                add_mod_to_installation();
                setIsChooseInstallation(!isChooseInstallation);
            }}>
                Add
            </button>

            {isChooseInstallation ?
                <select className={styles.button_overlay} onChange={() => setIsChooseInstallation(!isChooseInstallation)} onClick={(e) => {e.stopPropagation()}}>
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