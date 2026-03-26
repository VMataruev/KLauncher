// import img from "../../../assets/play-btn-img.png"
import { useState, useEffect } from 'react';
import styles from '../styles/style.module.css'
// import { Link } from 'react-router-dom';
import PlayButton from '../features/playButton/playButton';

function Home(): React.JSX.Element {

  const [ userName, setUserName ] = useState<string>();

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     const res = await window.api.getStore('user_info.playername');
  //     setUserName(res);
  //   }

  //   fetchUserName();
  // }, );

  // const logout = async () => {
  //   try {
  //     await window.api.deleteStore('user_info');
  //     setUserName(undefined);
  //   } catch (error) {
  //     console.log(error);
  //   };
  // };
  
  // const [data, setData] = useState<any>(null);

  const login = async (): Promise<void> => {
    try {
      await window.api.openLogin();
      setUserName("Logged in");
    } catch (error) {
      console.log(error);
    }
  };

  // const loadData = async (): Promise<void> => {
  //   const result = await window.api.getData();
  //   setData(result);
  // };

  type Installation = {
    id: string;
    img: string;
    name: string;
    version: string;
    version_link: string;
    mods: string[];
    folder: string | null;
  };


  const [ installationID, setInstallationID ] = useState<string>();
  const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
  useEffect(() => {
    const getInstallations = async () => {
      const res = await window.api.getStore("installations");
      setInstallations(res);
      const first = Object.values(res)[0] as Installation;
      setInstallationID(first.id);
      // console.log(first.id);
      // console.log(res);
    };
    getInstallations();
  }, []);

  
  
  

  return (
    <>
      <div className={styles.main_wrapper}>
        <div className={styles.header}>

        </div>



        <div className={styles.body}>
            {/* <div>
              <button onClick={loadData}>Получить данные</button>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div> */}
        </div>



        <div className={styles.basement}>
          
          <select name="installations" id="" onChange={(e) => setInstallationID(e.target.value)} className={styles.installations}>
            {installations ?
            Object.values(installations).map(version => (
              <>
                <option value={version.id}>{version.name}</option>
              </>
            ))
            :
            <></>
            }
          </select>
          

          <div className={styles.play}>
            {/* <button className={styles.play_btn} onClick={() => playButton(installationID)}>play</button> */}
            <PlayButton installation_id={installationID}></PlayButton>
            {/* <img src={img} alt="" /> */}
          </div>

          {/* {userName ? <div>{userName} <button onClick={() => logout()}>log out</button></div> : <Link to='/auth'>Authorize</Link>} */}
          {userName ? <div>{userName}</div> : <button onClick={login}>Войти</button>}
        </div>
      </div>
    </>
  )
}

export default Home
