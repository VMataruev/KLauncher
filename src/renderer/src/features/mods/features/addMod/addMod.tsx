import { useState } from "react";
import styles from "./addMod.module.css"
import Overlay from "./overlay/overlay";
import { Download } from "iconoir-react";

function AddModButton({mod, type}): React.JSX.Element {

    const [ overlay, setOverlay ] = useState<boolean>(false);

    return(
        <>
            {overlay ? <Overlay mod={mod} onClose={(e) => {setOverlay(false); e.stopPropagation()}}></Overlay> : <></>}
            <div className={styles.add_mod_button_box}>
                <button className={styles.add_mod_button} onClick={(e) => {
                    e.stopPropagation();
                    setOverlay(true)
                }}>
                    {type == "text" ? 
                        <>Download <Download></Download></> 
                        : 
                        <Download></Download>
                    }
                </button>

                {/* {isChooseInstallation ?
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
                } */}
            </div>
        </>
    )
}

export default AddModButton