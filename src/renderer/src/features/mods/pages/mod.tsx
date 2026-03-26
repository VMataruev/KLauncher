import styles from '../styles/mod.module.css'
import { useEffect, useState } from "react";
// import img from '../../../assets/background.png'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '@renderer/components/slider'
import ImageCarousel from '@renderer/components/slider';
import { useParams } from 'react-router-dom';

function Mod(): React.JSX.Element {

    const [mod, setMod] = useState<any>();
    const { id } = useParams();
    useEffect(() => {
        const fetchMods = async () => {
            try {
                const res = await window.api.getRequest(`https://mods.vintagestory.at/api/mod/${id}`);
                setMod(res.mod);
                console.log(res.mod)
            } catch (error) {
                console.log(error)
            }
        };

        fetchMods();
            
    }, [])

    if (!mod) {
        return <div>Downloading...</div>
    }


    return (
        <>
            <div className={styles.main_wrapper}>
                <div className={styles.header}>
                    <button>button</button>
                    <div>/ Mod/{mod.name}</div>
                    <button>button</button>
                </div>

                <div className={styles.mod_box} key={mod.modid}>
                    <div className={styles.mod_box_header}>
                        <div>Description</div>
                        <div>Files</div>
                        <div>Donate</div>
                    </div>

                    <div className={styles.mod_box_body}>
                        <div className={styles.mod_box_imgs_box}>
                            {/* <img src={img} alt="" /> */}
                            <ImageCarousel images={mod.screenshots.map(s => s.mainfile)}/>
                        </div>

                        <div className={styles.mod_box_info_box}>
                            <div className={styles.mod_box_tags}>Tags: <div className={styles.mod_box_tags_tag}>{mod.tags.map(t => <div>{t}</div>)}</div></div>
                            <div className={styles.mod_box_author}>Author: {mod.author}</div>
                            <div className={styles.mod_box_side}>Side: {mod.side}</div>
                            <div className={styles.mod_box_created}>Created: {mod.created}</div>
                            <div className={styles.mod_box_last_modified}>Last modified: {mod.lastmodified}</div>
                            <div className={styles.mod_box_downloads}>Downloads: {mod.downloads}</div>
                        </div>
                    </div>

                    <div className={styles.mod_box_basement}>
                        {/* ВАЖНО: используем dangerouslySetInnerHTML вместо {mod.text} */}
                        <div dangerouslySetInnerHTML={{ __html: mod.text }} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default Mod