import { useEffect, useRef, useState } from "react"
import styles from "../styles/style.module.css"
import { useNavigate } from "react-router-dom"
// import img from "../../../assets/mod_img.jpg"
import AddModButton from "../features/addMod/addMod";
import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";
import { useMemo } from "react";

import { Download } from 'iconoir-react';
import { Message } from "iconoir-react";
import { User } from "iconoir-react";
import Loader from "@renderer/components/loader/loader";


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
                console.log(window.api);
                console.log(window.api.getModsInCache);
                const res = await window.api.getModsInCache();
                console.log(res);
                if (res.status != "ok") {
                    await new Promise(resolve => setTimeout(resolve, 5000)); // ждем 5 сек
                    fetchMods();
                    return;
                }
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


    const refreshMods = async () => {
        setLoading(true);
        try {
            await window.api.clearModsCache();
            const res = await window.api.getModsInCache();
            setMods(res.mods);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setDisplayedMods(filteredMods.slice(0, BLOCK_SIZE));
        setHasMore(filteredMods.length > BLOCK_SIZE);
    }, [filteredMods]);

    const loadMore = () => {
        setDisplayedMods((prev) => {
            const currentLength = prev.length;
            const nextMods = filteredMods.slice(
            currentLength,
            currentLength + BLOCK_SIZE
            );

            const newLength = currentLength + nextMods.length;

            setHasMore(newLength < filteredMods.length);

            return [...prev, ...nextMods];
        });
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
        sessionStorage.setItem("mods-scroll-y", String(window.scrollY));
        sessionStorage.setItem("mods-from-detail", "true");
        navigate(`/mod/${modid}`);
    };

    const restoredRef = useRef(false);

    useEffect(() => {
        if (restoredRef.current) return;
        if (loading) return;
        if (!displayedMods.length) return;

        const fromDetail = sessionStorage.getItem("mods-from-detail");
        if (!fromDetail) return; // ⬅️ ключевая проверка

        const savedY = Number(sessionStorage.getItem("mods-scroll-y") || 0);
        if (!savedY) return;

        const maxScrollY =
            document.documentElement.scrollHeight - window.innerHeight;

        if (maxScrollY < savedY && hasMore) {
            loadMore();
            return;
        }

        setTimeout(() => {
            window.scrollTo(0, savedY);
            restoredRef.current = true;
            sessionStorage.removeItem("mods-scroll-y");
            sessionStorage.removeItem("mods-from-detail");
        }, 0);
    }, [loading, displayedMods.length, hasMore, filteredMods.length]);

    if (loading) {return <div className={styles.loader_wrapper}><Loader></Loader></div>}
  return (
    <>
        <div className={styles.main_wrapper}>
            <div className={styles.header}>

                <input className={styles.header_input} placeholder="Mod name" type="text" onChange={(e) =>setSearchName(e.target.value)} value={searchName} />
                <input className={styles.header_input} placeholder="Author" type="text" onChange={(e) =>setSearchAuthor(e.target.value)} value={searchAuthor} />

                <select className={styles.header_input} name="" id="" value={selectedVersion} onChange={(e) =>setSelectedVersion(e.target.value)}>
                    <option disabled value="">Versions</option>
                </select>

                <select className={styles.header_input} name="" id="" value={selectedTag} onChange={(e) =>setSelectedTag(e.target.value)}>
                    <option disabled value="">Tags</option>
                </select>
                    
                <select className={styles.header_input} name="" id="" value={selectedSide} onChange={(e) =>setSelectedSide(e.target.value)}>
                    <option value="Both">Both</option>
                    <option value="Server">Server</option>
                    <option value="Client">Client</option>
                </select>

                {/* TODO: Скрыть пункты ниже под одной кнопкой */}
                {/* <input className={styles.header_input} placeholder="isInstalled" type="text" />
                <button className={styles.header_input} onClick={() => handleSort("downloads")}>Downloads {sortType=== "downloads" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                <button className={styles.header_input} onClick={() => handleSort("follows")}>Follows {sortType ==="follows" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                <button className={styles.header_input} onClick={() => handleSort("newest")}>Newest {sortType ==="newest" && (sortOrder === "asc" ? "↑" : "↓")}</button>
                <button className={styles.header_input} onClick={() => handleSort("name")}>A-Z {sortType ==="name" && (sortOrder === "asc" ? "↑" : "↓")}</button> */}
                <button className={styles.header_input} onClick={() => resetFilters()}>Reset filters</button>
                <button className={styles.header_input} onClick={() => refreshMods()}>Refresh Mods</button>

            </div>


            <div className={styles.mods_wrapper}>

                {loading ? <></> : ( // пережиток прошлого, который можно почистить, тут больше нет условия, лоадер теперь грузится через return
                    displayedMods.map(mod => (
                        <div className={styles.mod_box} key={mod.modid} onClick={() => handleModClick(mod.modid)}>
                            {mod.logo ? (<img className={styles.mod_img} src={mod.logo} alt="" />) : (<img className={styles.mod_img} src="https://mods.vintagestory.at/web/img/mod-default.png" alt="" />)}
                            <div className={styles.add_mod_button_box}><AddModButton mod={mod}></AddModButton></div>
                            <div className={styles.mod_info_box}>
                                <div className={styles.mod_numbers_info}>
                                    <div className={styles.mod_info}>
                                        <User className={styles.icon}></User>
                                        <div className={styles.mod_info_text}>{mod.author}</div>
                                    </div>
                                    <div className={styles.mod_info}>
                                        <Download className={styles.icon}></Download>
                                        <div className={styles.mod_info_text}>{mod.downloads}</div>
                                    </div>
                                    <div className={styles.mod_info}>
                                        <Message className={styles.icon}></Message>
                                        <div className={styles.mod_info_text}>{mod.comments}</div>
                                    </div>
                                </div>
                                <div className={styles.devider}></div>
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