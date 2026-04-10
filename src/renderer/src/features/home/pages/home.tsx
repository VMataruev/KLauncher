// import img from "../../../assets/play-btn-img.png"
import { useState, useEffect } from 'react';
import styles from '../styles/style.module.css'
// import { Link } from 'react-router-dom';
import PlayButton from '../features/playButton/playButton';
import Blog from '../features/blog/blog';
import ProgressBar from '../features/progressBar/progressBar';
import CustomSelect from '@renderer/components/CustomSelect/CustomSelect';

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
    const init = async () => {
      const res = await window.api.getStore("installations");
      setInstallations(res);

      const saved = await window.api.getStore("installation_to_start");

      if (saved && res[saved]) {
        // если есть сохранённый и он существует
        setInstallationID(saved);
      } else {
        // иначе берём первый
        const first = Object.values(res)[0] as Installation | undefined;
        if (first) {
          setInstallationID(first.id);
        }
      }
    };

    init();
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
          <select name="installations" id="" value={installationID ?? ""} onChange={ async (e) => {
            const id = e.target.value;
            setInstallationID(id);
            await window.api.setStore('installation_to_start', id);
          }} 
          className={styles.installations}>
            {Object.keys(installations).length > 0 ?
            Object.values(installations).map(version => (
              <option value={version.id}>{version.name}</option>
            ))
            :
            <option value=" disabled">Create installation first</option>
            }
          </select>

          {/* <CustomSelect></CustomSelect> */}
          

          <div className={styles.play}>
            {/* <button className={styles.play_btn} onClick={() => playButton(installationID)}>play</button> */}
            <PlayButton installation_id={installationID}></PlayButton>
            {/* <img src={img} alt="" /> */}
          </div>

          {/* {userName ? <div>{userName} <button onClick={() => logout()}>log out</button></div> : <Link to='/auth'>Authorize</Link>} */}
          {userName ? <div>{userName}</div> : <button onClick={login}>Войти</button>}
        </div>

        <div className={styles.blog_box}>
          <Blog></Blog>
        </div>
      </div>

      <ProgressBar></ProgressBar>
    </>
  )
}

export default Home
