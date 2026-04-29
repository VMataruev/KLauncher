import styles from "../styles/header.module.css"
import { User } from 'iconoir-react';
import { Home as HomeIcon } from 'iconoir-react';
import { Play as PlayIcon } from 'iconoir-react';
import { Folder as FolderIcon } from 'iconoir-react';
import { Tools as ToolsIcon } from 'iconoir-react';
import { Settings as SettingsIcon } from 'iconoir-react';
import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import LogInButton from "../features/logInButton/logInButton";

function Header(): React.JSX.Element {

    const location = useLocation();

    const refs = {
        '/': useRef(null),
        "/play": useRef<HTMLDivElement | null>(null),
        "/installations": useRef<HTMLDivElement | null>(null),
        "/mods": useRef<HTMLDivElement | null>(null),
        "/settings": useRef<HTMLDivElement | null>(null),
    };

    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const el = refs[location.pathname]?.current;
        if (el) {
            setOffset(el.offsetTop + el.offsetHeight / 2 - 80);
        }
    }, [location.pathname]);


    return(
        <>
            <div className={styles.header}>
                <div className={styles.box_up}>
                    {/* <div className={styles.logInBox}>
                        <User></User>
                        <div>Log In</div>
                        
                    </div> */}
                    <LogInButton></LogInButton>

                    <div className={styles.page_indicator} style={{ transform: `translateY(${offset}px)` }}/>
                    <div ref={refs['/']} className={styles.link_box}>
                        {location.pathname === '/' ? 
                            <>
                                <div className={styles.link_box_inside}>
                                    <HomeIcon className={styles.page_activate_color}></HomeIcon>
                                    <Link className={`${styles.link_button} ${styles.page_activate_color}`} to="/">Home</Link>
                                </div>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <div className={styles.link_box_inside}>
                                    <HomeIcon></HomeIcon>
                                    <Link className={styles.link_button} to="/">Home</Link>
                                </div>
                            </>
                            
                        }
                    </div>

                    <div ref={refs['/play']} className={styles.link_box}>
                        {location.pathname === '/play' ? 
                            <>
                                <div className={styles.link_box_inside}>
                                    <PlayIcon className={styles.page_activate_color}></PlayIcon>
                                    <Link className={`${styles.link_button} ${styles.page_activate_color}`} to="/play">Play</Link>
                                </div>
                                
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <div className={styles.link_box_inside}>
                                    <PlayIcon></PlayIcon>
                                    <Link className={styles.link_button} to="/play">Play</Link>
                                </div>
                            </>
                            
                        }
                    </div>

                    <div ref={refs['/installations']} className={styles.link_box}>
                        {location.pathname === '/installations' ? 
                            <>
                                <div className={styles.link_box_inside}>
                                    <FolderIcon className={styles.page_activate_color}></FolderIcon>
                                    <Link className={`${styles.link_button} ${styles.page_activate_color}`} to="/installations">Installations</Link>
                                </div>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <div className={styles.link_box_inside}>
                                    <FolderIcon></FolderIcon>
                                    <Link className={styles.link_button} to="/installations">Installations</Link>
                                </div>
                            </>
                            
                        }
                    </div>

                    <div ref={refs['/mods']} className={styles.link_box}>
                        {location.pathname === '/mods' ? 
                            <>
                                <div className={styles.link_box_inside}>
                                    <ToolsIcon className={styles.page_activate_color}></ToolsIcon>
                                    <Link className={`${styles.link_button} ${styles.page_activate_color}`} to="/mods">Mods</Link>
                                </div>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <div className={styles.link_box_inside}>
                                    <ToolsIcon></ToolsIcon>
                                    <Link className={styles.link_button} to="/mods">Mods</Link>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className='box-down'>

                    <div ref={refs['/settings']} className={styles.link_box}>
                        {location.pathname === '/settings' ? 
                            <>
                                <div className={styles.link_box_inside}>
                                    <SettingsIcon className={styles.page_activate_color}></SettingsIcon>
                                    <Link className={`${styles.link_button} ${styles.page_activate_color}`} to="/settings">Settings</Link>
                                </div>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <div className={styles.link_box_inside}>
                                    <SettingsIcon></SettingsIcon>
                                    <Link className={styles.link_button} to="/settings">Settings</Link>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header