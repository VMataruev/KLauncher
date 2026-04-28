import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from "./features/home/pages/home";
import Installations from "./features/installations/pages/installations";
import Mods from './features/mods/pages/mods';
import Mod from './features/mods/pages/mod'
import Settings from './features/settings/pages/settings';
import Made_installation from './features/installations/pages/made_installation';
import Auth from './features/auth/pages/auth';
import Notifications from './features/overlay/notification/pages/notification';
import Installation_settings from './features/installations/pages/installation_settings';
import Play from './features/play/pages/play'

import { User } from 'iconoir-react';
import { Home as HomeIcon } from 'iconoir-react';
import { Play as PlayIcon } from 'iconoir-react';
import { Folder as FolderIcon } from 'iconoir-react';
import { Tools as ToolsIcon } from 'iconoir-react';
import { Settings as SettingsIcon } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';

function App(): React.JSX.Element {
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

  return (
    <div className="main-pages-wrapper">
      <Notifications></Notifications>




      <div className="header">
        <div className='box-up'>
            <div className='logInBox'>
                <User></User>
                <div>Log In</div>
            </div>

            <div className="page-indicator"style={{ transform: `translateY(${offset}px)` }}/>
            <div ref={refs['/']} className="link_box">
                {location.pathname === '/' ? 
                    <>
                        <div className="link_box_inside">
                            <HomeIcon className='page-activate-color'></HomeIcon>
                            <Link className="link-button page-activate-color" to="/">Home</Link>
                        </div>
                        {/* <div className='page-indicator page-active'></div> */}
                    </>
                    : 
                    <>
                        <div className="link_box_inside">
                            <HomeIcon></HomeIcon>
                            <Link className='link-button' to="/">Home</Link>
                        </div>
                    </>
                    
                }
            </div>

            <div ref={refs['/play']} className="link_box">
                {location.pathname === '/play' ? 
                    <>
                        <div className="link_box_inside">
                            <PlayIcon className='page-activate-color'></PlayIcon>
                            <Link className="link-button page-activate-color" to="/play">Play</Link>
                        </div>
                        
                        {/* <div className='page-indicator page-active'></div> */}
                    </>
                    : 
                    <>
                        <div className="link_box_inside">
                            <PlayIcon></PlayIcon>
                            <Link className='link-button' to="/play">Play</Link>
                        </div>
                    </>
                    
                }
            </div>

            <div ref={refs['/installations']} className="link_box">
                {location.pathname === '/installations' ? 
                    <>
                        <div className="link_box_inside">
                            <FolderIcon className='page-activate-color'></FolderIcon>
                            <Link className="link-button page-activate-color" to="/installations">Installations</Link>
                        </div>
                        {/* <div className='page-indicator page-active'></div> */}
                    </>
                    : 
                    <>
                        <div className="link_box_inside">
                            <FolderIcon></FolderIcon>
                            <Link className='link-button' to="/installations">Installations</Link>
                        </div>
                    </>
                    
                }
            </div>

            <div ref={refs['/mods']} className="link_box">
                {location.pathname === '/mods' ? 
                    <>
                        <div className="link_box_inside">
                            <ToolsIcon className='page-activate-color'></ToolsIcon>
                            <Link className="link-button page-activate-color" to="/mods">Mods</Link>
                        </div>
                        {/* <div className='page-indicator page-active'></div> */}
                    </>
                    : 
                    <>
                        <div className="link_box_inside">
                            <ToolsIcon></ToolsIcon>
                            <Link className='link-button' to="/mods">Mods</Link>
                        </div>
                    </>
                }
            </div>
        </div>
        <div className='box-down'>

            <div ref={refs['/settings']} className="link_box">
                {location.pathname === '/settings' ? 
                    <>
                        <div className="link_box_inside">
                            <SettingsIcon className='page-activate-color'></SettingsIcon>
                            <Link className="link-button page-activate-color" to="/settings">Settings</Link>
                        </div>
                        {/* <div className='page-indicator page-active'></div> */}
                    </>
                    : 
                    <>
                        <div className="link_box_inside">
                            <SettingsIcon></SettingsIcon>
                            <Link className='link-button' to="/settings">Settings</Link>
                        </div>
                    </>
                }
            </div>
        </div>
      </div>
          
          


      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/play" element={<Play/>} />
        <Route path="/installations" element={<Installations />} />
        <Route path="/mods" element={<Mods />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mod/:id" element={<Mod />} />
        <Route path='/made_installation' element={<Made_installation/>}></Route>
        <Route path='/auth' element={<Auth></Auth>}></Route>
        <Route path='/installation_settings/:id' element={<Installation_settings></Installation_settings>}></Route>
      </Routes>
    </div>
  )
}

export default App
