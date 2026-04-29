import { Routes, Route } from 'react-router-dom';
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


import Header from './features/header/pages/header';

function App(): React.JSX.Element {
    

    return (
        <div className="main-pages-wrapper">
            <Notifications></Notifications>

            <Header></Header>

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
