import styles from "../styles/play.module.css"
import img from "../../../assets/background.png"
import PlayButton from "../features/playButton/playButton"
import { useEffect, useState } from "react";
import ProgressBar from "../features/progressBar/progressBar";
import SelectInstallations from "../features/selectInstallation/selectInstallation";
import character from "@renderer/assets/character.png";

function Play(): React.JSX.Element {
    // type Installation = {
    //     id: string;
    //     img: string;
    //     name: string;
    //     version: string;
    //     version_link: string;
    //     mods: string[];
    //     folder: string | null;
    // };

    const [ installationID, setInstallationID ] = useState<string>();
    // const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
    // useEffect(() => {
    //     const init = async () => {
    //         const res = await window.api.getStore("installations");
    //         setInstallations(res);

    //         const saved = await window.api.getStore("installation_to_start");

    //         if (saved && res[saved]) {
    //             // если есть сохранённый и он существует
    //             setInstallationID(saved);
    //         } else {
    //             // иначе берём первый
    //             const first = Object.values(res)[0] as Installation | undefined;
    //             if (first) {
    //             setInstallationID(first.id);
    //             }
    //         }
    //     };
    //     init();
    // }, []);

    return(
        <>
            <div className={styles.page_wrapper}>
                <img src={character} className={styles.character} alt="" />
                <ProgressBar></ProgressBar>
                <div className={styles.main_box}>
                    <div className={styles.h1}>Vintage Story</div>
                    <div className={styles.span}>Place where fun and creativity begin</div>
                    <div className={styles.buttons_box}>
                        <PlayButton></PlayButton>
                        {/* <select name="installations" id="" value={installationID ?? ""} onChange={ async (e) => {
                            const id = e.target.value;
                            setInstallationID(id);
                            await window.api.setStore('installation_to_start', id);
                        }} 
                        className={styles.installations}>
                            {Object.keys(installations).length > 0 ?
                            Object.values(installations).map(version => (
                            <option value={version.id}>{version.name}</option>
                            ))
                            :
                            <option value=" disabled">Create installation first</option>
                            }
                        </select> */}

                        <SelectInstallations></SelectInstallations>

                    </div>
                </div>
                <div className={styles.vid_box}>
                    <iframe
                    src="https://www.youtube.com/embed/NJjifFq1NGY"
                    allowFullScreen
                    />
                    <iframe
                    src="https://www.youtube.com/embed/mgvzBB_--xM?si=z2JRDAErFWIseeT2"
                    allowFullScreen
                    />
                </div>
            </div>
        </>
    )
}

export default Play