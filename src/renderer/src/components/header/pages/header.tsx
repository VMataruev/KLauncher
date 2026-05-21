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
                                <Link className={styles.link_box_inside} to="/">
                                    <HomeIcon className={styles.page_activate_color}></HomeIcon>
                                    <div className={`${styles.link_button} ${styles.page_activate_color}`}>Home</div>
                                </Link>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <Link className={styles.link_box_inside} to="/">
                                    <HomeIcon></HomeIcon>
                                    <div className={styles.link_button}>Home</div>
                                </Link>
                            </>
                            
                        }
                    </div>

                    <div ref={refs['/play']} className={styles.link_box}>
                        {location.pathname === '/play' ? 
                            <>
                                <Link className={styles.link_box_inside} to="/play">
                                    <PlayIcon className={styles.page_activate_color}></PlayIcon>
                                    <div className={`${styles.link_button} ${styles.page_activate_color}`}>Play</div>
                                </Link>
                                
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <Link className={styles.link_box_inside} to="/play">
                                    <PlayIcon></PlayIcon>
                                    <div className={styles.link_button}>Play</div>
                                </Link>
                            </>
                            
                        }
                    </div>

                    <div ref={refs['/installations']} className={styles.link_box}>
                        {location.pathname === '/installations' ? 
                            <>
                                <Link className={styles.link_box_inside} to="/installations">
                                    <FolderIcon className={styles.page_activate_color}></FolderIcon>
                                    <div className={`${styles.link_button} ${styles.page_activate_color}`}>Installations</div>
                                </Link>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <Link className={styles.link_box_inside} to="/installations">
                                    <FolderIcon></FolderIcon>
                                    <div className={styles.link_button}>Installations</div>
                                </Link>
                            </>
                            
                        }
                    </div>

                    <div ref={refs['/mods']} className={styles.link_box}>
                        {location.pathname === '/mods' ? 
                            <>
                                <Link className={styles.link_box_inside} to="/mods">
                                    <ToolsIcon className={styles.page_activate_color}></ToolsIcon>
                                    <div className={`${styles.link_button} ${styles.page_activate_color}`}>Mods</div>
                                </Link>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <Link className={styles.link_box_inside} to="/mods">
                                    <ToolsIcon></ToolsIcon>
                                    <div className={styles.link_button}>Mods</div>
                                </Link>
                            </>
                        }
                    </div>
                </div>
                <div className='box-down'>

                    <div ref={refs['/settings']} className={styles.link_box}>
                        {location.pathname === '/settings' ? 
                            <>
                                <Link className={styles.link_box_inside} to="/settings">
                                    <SettingsIcon className={styles.page_activate_color}></SettingsIcon>
                                    <div className={`${styles.link_button} ${styles.page_activate_color}`}>Settings</div>
                                </Link>
                                {/* <div className='page-indicator page-active'></div> */}
                            </>
                            : 
                            <>
                                <Link className={styles.link_box_inside} to="/settings">
                                    <SettingsIcon></SettingsIcon>
                                    <div className={styles.link_button}>Settings</div>
                                </Link>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header