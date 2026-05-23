import { useEffect, useState } from "react";
import styles from "./selectInstallation.module.css";
import iconOptions from "@renderer/components/Installation_icons";



function SelectInstallations(): React.JSX.Element {

    const iconMap = Object.fromEntries(
        iconOptions.map(i => [i.id, i.icon])
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);

    type Installation = {
        id: string;
        img: string;
        name: string;
        version: string;
        version_link: string;
        mods: string[];
        folder: string | null;
    };
    
    const [ _installationID, setInstallationID] = useState<string>();
    const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
    const [ installationToShow, setInstallationToShow ] = useState<Installation>();
    useEffect(() => {
        const init = async () => {
            const res = await window.api.getStore("installations");
            setInstallations(res);

            const saved = await window.api.getStore("installation_to_start"); // id
            const saved_installation = await window.api.getStore(`installations.${saved}`);
            console.log(saved_installation)
            console.log(saved);

            if (saved && res[saved]) {
                // если есть сохранённый и он существует
                setInstallationID(saved);
                const installation = await window.api.getStore(`installations.${saved}`);
                setInstallationToShow(installation);
                set_installation_to_start(installation.id);
            } else {
                // иначе берём первый
                const first = Object.values(res)[0] as Installation | undefined;
                if (first) {
                    setInstallationID(first.id);
                    const installation = await window.api.getStore(`installations.${first.id}`);
                    setInstallationToShow(installation);
                    set_installation_to_start(installation.id);
                }
            }
        };
        init();
    }, []);

    const set_installation_to_start = async (id) => {
        await window.api.setStore('installation_to_start', id);
    };

    return(
        <div className={styles.relative}>
            {/* <CustomSelectInstallation options={installations} value={""}></CustomSelectInstallation> */}
            <div className={styles.select_wrapper} onClick={() => setIsOpen(!isOpen)}>
                {installationToShow && (
                <div className={styles.box_left}>
                    <div className={styles.box_1}><img src={iconMap[installationToShow.img]} className={styles.img} alt="" /></div>
                    <div className={styles.box_2}>
                        <div>{installationToShow.name}</div>
                        <div className={styles.card_version}>{installationToShow.version}</div>
                    </div>
                </div>
                )}
                {Object.values(installations).length === 0 ? <div className={styles.no_installations}>No installations</div> : <></>}
                <div className={`${styles.box_right} ${isOpen ? styles.turn : styles.nothing}`}>{'>'}</div>
            </div>

            <div className={`${styles.dropdown_wrapper} ${isOpen ? styles.open : styles.closed}`}>
                {Object.values(installations).map(installation => (
                <div className={styles.card} onClick={() => {
                    setInstallationToShow(installation); 
                    setIsOpen(false);
                    set_installation_to_start(installation.id);
                }}>
                    <div className={styles.left_box}><img src={iconMap[installation.img]} className={styles.img}alt="" /></div>
                    <div className={styles.right_box}>
                        <div>{installation.name}</div>
                        <div className={styles.card_version}>{installation.version}</div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}

export default SelectInstallations