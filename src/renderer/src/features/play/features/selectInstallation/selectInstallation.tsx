import { useEffect, useState } from "react";
import styles from "./selectInstallation.module.css";
import iconOptions from "@renderer/components/Installation_icons";
import { Clock } from "iconoir-react";
import { Wrench } from "iconoir-react";
import { Globe } from "iconoir-react";



function SelectInstallations(): React.JSX.Element {

    const iconMap = Object.fromEntries(
        iconOptions.map(i => [i.id, i.icon])
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);
    
    const [ _installationID, setInstallationID] = useState<string>();
    const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
    const [ installationToShow, setInstallationToShow ] = useState<Installation>();
    const [ totalPlayedTime, setTotalPlayedTime ] = useState<number>(0);
    useEffect(() => {
        const init = async () => {
            const res = await window.api.getStore("installations") as Record<string, Installation>;
            setInstallations(res);
            const totalPlayedTime = Object.values(res).reduce((sum, installation) => sum + installation.time_played, 0);
            const totalPlayedTimeInHours = (totalPlayedTime / 60).toFixed(1);
            setTotalPlayedTime(Number(totalPlayedTimeInHours));

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
                        <div className={styles.installation_info_box}>
                            <div className={styles.card_version}>{installationToShow.version}</div>
                            <div className={styles.card_version_icon_box}><Clock className={styles.card_version_icon}></Clock>{(installationToShow.time_played / 60).toFixed(1)}h</div>
                            {!(installationToShow.mods.length > 0) ? <></> : <div className={styles.card_version_icon_box}><Wrench className={styles.card_version_icon}></Wrench><div className={styles.card_version}>{installationToShow.mods.length}</div></div>}
                        </div>
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
                        <div className={styles.installation_info_box}>
                            <div className={styles.card_version}>{installation.version}</div>
                            <div className={styles.card_version_icon_box}><Clock className={styles.card_version_icon}></Clock>{(installation.time_played / 60).toFixed(1)}h</div>
                            {!(installation.mods.length > 0) ? <></> : <div className={styles.card_version_icon_box}><Wrench className={styles.card_version_icon}></Wrench><div className={styles.card_version}>{installation.mods.length}</div></div>}
                        </div>
                    </div>
                </div>
                ))}
                <div className={styles.time_played_total_box}>
                    <div className={styles.time_played_total_icon_box}><Globe className={styles.time_played_total_icon}></Globe></div>
                    <div className={styles.time_played_total_info_box}>
                        <div className={styles.time_played_total_hours}>{totalPlayedTime}h</div>
                        <div className={styles.time_played_total_text}>Total played time</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectInstallations