import { useEffect, useState } from "react"
import styles from "../styles/style.module.css"
import { useNavigate } from "react-router-dom"
// import img from "../../../assets/mod_img.jpg"


function Mods(): React.JSX.Element {

    interface Mod {
        modid: number
        assetid: number
        downloads: number
        follows: number
        trendingpoints: number
        comments: number
        name: string
        summary: string
        modidstrs: string[]  // массив строк
        author: string
        urlalias: string
        side: string
        type: string
        logo: string | null  // может быть null
        tags: string[]  // массив строк
        lastreleased: string  // дата в формате строки
    }

    const [mods, setMods] = useState<Mod[]>([]);

    useEffect(() => {
        const fetchMods = async () => {
            try {
                const res = await window.api.getRequest("http://mods.vintagestory.at/api/mods");
                setMods(res.mods);
                console.log(res.mods)
            } catch (error) {
                console.log(error)
            }
        };

        fetchMods();
        
    }, [])

    const navigate = useNavigate();
    const handleModClick = (modid: number) => {
        navigate(`/mod/${modid}`)
    }

  return (
    <>
        <div className={styles.main_wrapper}>
            <div className={styles.header}>
                <div className={`${styles.header_line} ${styles.header_line_main}`}>
                    <div>
                        <button>Button</button>
                        <button>Button</button>
                    </div>
                    <div>/ Mods</div>
                    <button>Button</button>
                </div>
                <div className={styles.header_line}>
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                </div>
                <div className={styles.header_line}>
                    <input type="text" />
                    <button>Button</button>
                    <button>Button</button>
                    <button>Button</button>
                </div>
            </div>


            <div className={styles.mods_wrapper}>

                {mods.map(mod => (
                    <div className={styles.mod_box} key={mod.modid} onClick={() => handleModClick(mod.modid)}>
                        {mod.logo ? (<img className={styles.mod_img} src={mod.logo} alt="" />) : (<img className={styles.mod_img} src="https://mods.vintagestory.at/web/img/mod-default.png" alt="" />)}
                        <div className={styles.mod_info_box}>
                            <div className={styles.mod_text_info}>
                                <div className={styles.mod_name}>{mod.name}</div>
                                <div className={styles.mod_description}>{mod.summary}</div>
                            </div>
                            <div className={styles.mod_numbers_info}>
                                <div className={styles.mod_downloads}>{mod.downloads}</div>
                                <div className={styles.mod_comments}>{mod.comments}</div>
                            </div>
                        </div>
                    </div>
                ))}


                {/* <div className={styles.mod_box}>
                    <img className={styles.mod_img} src={img} alt="" />
                    <div className={styles.mod_info_box}>
                        <div className={styles.mod_text_info}>
                            <div className={styles.mod_name}>modnamemodnamemodnamemodname</div>
                            <div className={styles.mod_description}>mod.summarymod namemodsummarymod  namemod namemod name</div>
                        </div>
                        <div className={styles.mod_numbers_info}>
                            <div className={styles.mod_downloads}>3151313</div>
                            <div className={styles.mod_comments}>12312</div>
                        </div>
                    </div>
                </div> */}


            </div>
        </div>
    </>
  )
}

export default Mods