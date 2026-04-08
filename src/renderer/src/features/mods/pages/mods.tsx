import { useEffect, useState } from "react"
import styles from "../styles/style.module.css"
import { useNavigate } from "react-router-dom"
// import img from "../../../assets/mod_img.jpg"
import AddModButton from "../features/addMod/addMod";
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";
import { useMemo } from "react";

const BLOCK_SIZE = 40; // сколько модов загружаем за один раз

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
    const [displayedMods, setDisplayedMods] = useState<Mod[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState<boolean>(true);

    // ==== Filters =====
    const [searchName, setSearchName] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [selectedSide, setSelectedSide] = useState("Both");

    const [sortType, setSortType] = useState<"downloads" | "follows" | "newest" | "name" | "">("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    // ========================

    const filteredMods = useMemo(() => {
        let result = [...mods];

        // ===== Поиск по имени =====
        if (searchName.trim()) {
            result = result.filter((mod) =>
                mod.name.toLowerCase().includes(searchName.trim().toLowerCase())
            );
        }

        // ===== Поиск по автору =====
        if (searchAuthor.trim()) {
            result = result.filter((mod) =>
                mod.author.toLowerCase().includes(searchAuthor.trim().toLowerCase())
            );
        }

        // ===== Фильтр по версии =====
        if (selectedVersion) {
            result = result.filter((mod) =>
                mod.tags.includes(selectedVersion)
            );
        }

        // ===== Фильтр по тегу =====
        if (selectedTag) {
            result = result.filter((mod) =>
                mod.tags.includes(selectedTag)
            );
        }

        // ===== Фильтр по стороне =====
        if (selectedSide !== "Both") {
            result = result.filter((mod) =>
                mod.side.toLowerCase() === selectedSide.toLowerCase()
            );
        }

        // ===== Сортировка =====
        switch (sortType) {
            case "downloads":
                result.sort((a, b) =>
                    sortOrder === "asc"
                        ? a.downloads - b.downloads
                        : b.downloads - a.downloads
                );
                break;

            case "follows":
                result.sort((a, b) =>
                    sortOrder === "asc"
                        ? a.downloads - b.downloads
                        : b.downloads - a.downloads
                );
                break;

            case "newest":
                result.sort((a, b) =>
                    sortOrder === "asc"
                        ? new Date(a.lastreleased).getTime() - new Date(b.lastreleased).getTime()
                        : new Date(b.lastreleased).getTime() - new Date(a.lastreleased).getTime()
                );
                break;

            case "name":
                result.sort((a, b) =>
                    sortOrder === "asc"
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name)
                );
                break;
        }

        return result;
    }, [mods, searchName, searchAuthor, selectedVersion, selectedTag, selectedSide, sortType, sortOrder]);

    const handleSort = (type: typeof sortType) => {
        if (sortType === type) {
            // если нажали ту же кнопку → переворачиваем направление
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            // если новая кнопка → задаём тип и дефолтное направление
            setSortType(type);
            setSortOrder("desc"); // обычно логично по убыванию (топ сначала)
        }
    };

    // filtered by downloads as standard setting
    useEffect(() => {
        handleSort("downloads");
    }, [])
    

    const resetFilters = () => {
        setSearchName("");
        setSearchAuthor("");
        setSelectedVersion("");
        setSelectedTag("");
        setSelectedSide("Both");
        setSortType("");
    };

    useEffect(() => {
        const fetchMods = async () => {
            try {
                const res = await window.api.getRequest("http://mods.vintagestory.at/api/mods");
                setMods(res.mods);
                // setDisplayedMods(res.mods.slice(0, BLOCK_SIZE));
                // setHasMore(res.mods.length > BLOCK_SIZE);
                // console.log(res.mods)
            } catch (error) {
                console.log(error)
                addNotification({status: "error", msg: `${error}`})
            } finally {
                setLoading(false);
            }
        };

        fetchMods();
        
    }, []);

    useEffect(() => {
        setDisplayedMods(filteredMods.slice(0, BLOCK_SIZE));
        setHasMore(filteredMods.length > BLOCK_SIZE);
    }, [filteredMods]);

    const loadMore = () => {
        const currentLength = displayedMods.length;
        // const nextMods = mods.slice(currentLength, currentLength + BLOCK_SIZE);
        const nextMods = filteredMods.slice(currentLength, currentLength + BLOCK_SIZE);
        // setDisplayedMods([...displayedMods, ...nextMods]);
        setDisplayedMods((prev) => [...prev, ...nextMods]);
        // if (currentLength + BLOCK_SIZE >= mods.length) setHasMore(false);
        if (currentLength + BLOCK_SIZE >= filteredMods.length) setHasMore(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
            hasMore
            ) {
            loadMore();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [displayedMods, hasMore]);

    

    const navigate = useNavigate();
    const handleModClick = (modid: number) => {
        navigate(`/mod/${modid}`)
    };

    // TODO: mods to cache, it will be better to not load mods every time instead of search mod which had been uploaded second ago

  return (
    <>
        <div className={styles.main_wrapper}>
            <div className={styles.header}>
                {/* <div className={`${styles.header_line} ${styles.header_line_main}`}>
                    <div>
                        <button>Button</button>
                        <button>Button</button>
                    </div>
                    <div>/ Mods</div>
                    <button>Button</button>
                </div> */}
                <div className={styles.header_line}>
                    <input className={styles.header_input} placeholder="Mod name" type="text" onChange={(e) => setSearchName(e.target.value)} value={searchName} />
                    <input className={styles.header_input} placeholder="Author" type="text" onChange={(e) => setSearchAuthor(e.target.value)} value={searchAuthor} />

                    <select className={styles.header_input} name="" id="" value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)}>
                        <option disabled value="">Versions</option>
                    </select>

                    <select className={styles.header_input} name="" id="" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                        <option disabled value="">Tags</option>
                    </select>
                    
                    <select className={styles.header_input} name="" id="" value={selectedSide} onChange={(e) => setSelectedSide(e.target.value)}>
                        <option value="Both">Both</option>
                        <option value="Server">Server</option>
                        <option value="Client">Client</option>
                    </select>
                </div>
                <div className={styles.header_line}>
                    <input className={styles.header_input} placeholder="isInstalled" type="text" />
                    <button className={styles.header_input} onClick={() => handleSort("downloads")}>Downloads {sortType === "downloads" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                    <button className={styles.header_input} onClick={() => handleSort("follows")}>Follows {sortType === "follows" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                    <button className={styles.header_input} onClick={() => handleSort("newest")}>Newest {sortType === "newest" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                    <button className={styles.header_input} onClick={() => handleSort("name")}>A-Z {sortType === "name" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                    <button className={styles.header_input} onClick={() => resetFilters()}>Reset filters</button>
                </div>
            </div>


            <div className={styles.mods_wrapper}>

                {loading ? <div className={styles.loading}>loading</div> : (
                    displayedMods.map(mod => (
                        <div className={styles.mod_box} key={mod.modid} onClick={() => handleModClick(mod.modid)}>
                            {mod.logo ? (<img className={styles.mod_img} src={mod.logo} alt="" />) : (<img className={styles.mod_img} src="https://mods.vintagestory.at/web/img/mod-default.png" alt="" />)}
                            <div className={styles.add_mod_button_box}><AddModButton modID={mod.modid}></AddModButton></div>
                            <div className={styles.mod_info_box}>
                                <div className={styles.mod_numbers_info}>
                                    <div className={styles.mod_downloads}>{mod.downloads}</div>
                                    <div className={styles.mod_comments}>{mod.comments}</div>
                                </div>
                                <div className={styles.mod_text_info}>
                                    <div className={styles.mod_name}>{mod.name}</div>
                                    <div className={styles.mod_description}>{mod.summary}</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}


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