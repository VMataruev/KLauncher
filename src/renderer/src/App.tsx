import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from "./features/home/pages/home";
import Installations from "./features/installations/pages/installations";
import Mods from './features/mods/pages/mods';
import Mod from './features/mod/pages/mod'
import Settings from './features/settings/pages/settings';
import Made_installation from './features/installations/pages/made_installation';

function App(): React.JSX.Element {
  const location = useLocation();

  return (
    <>
      <div className="header">
        <div className="link_box">
          <Link to="/">Играть</Link>
          <div className={`page-indicator ${location.pathname === '/' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
        <div className="link_box">
          <Link to="/Installations">Установки</Link>
          <div className={`page-indicator ${location.pathname === '/Installations' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
        <div className="link_box">
          <Link to="/Mods">Моды</Link>
          <div className={`page-indicator ${location.pathname === '/Mods' ? 'page-active' : 'page-deactive'}`}></div>
        </div>
        <div className="link_box">
          <Link to="/Settings">Настройки</Link>
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
      </Routes>
    </>
  )
}

export default App
