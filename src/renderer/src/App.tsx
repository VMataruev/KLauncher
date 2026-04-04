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

function App(): React.JSX.Element {
  const location = useLocation();

  return (
    <>
      <Notifications></Notifications>
      <div className="header">
        <div className="link_box">
          <Link to="/">Play</Link>
          <div className={`page-indicator ${location.pathname === '/' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
        <div className="link_box">
          <Link to="/Installations">Installations</Link>
          <div className={`page-indicator ${location.pathname === '/Installations' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
        <div className="link_box">
          <Link to="/Mods">Mods</Link>
          <div className={`page-indicator ${location.pathname === '/Mods' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
        <div className="link_box">
          <Link to="/Settings">Settings</Link>
          <div className={`page-indicator ${location.pathname === '/Settings' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
      </div>
          
          
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/installations" element={<Installations />} />
        <Route path="/mods" element={<Mods />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mod/:id" element={<Mod />} />
        <Route path='/made_installation' element={<Made_installation/>}></Route>
        <Route path='/auth' element={<Auth></Auth>}></Route>
        <Route path='/installation_settings/:id' element={<Installation_settings></Installation_settings>}></Route>
      </Routes>
    </>
  )
}

export default App
