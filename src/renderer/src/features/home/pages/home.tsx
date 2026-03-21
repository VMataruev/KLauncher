// import img from "../../../assets/play-btn-img.png"
import { useEffect, useState } from 'react';
import styles from '../styles/style.module.css'
import { Link } from 'react-router-dom';

function Home(): React.JSX.Element {

  const [ userName, setUserName ] = useState<string>();

  useEffect(() => {
    const fetchUserName = async () => {
      const res = await window.api.getStore('user_info.playername');
      setUserName(res);
    }

    fetchUserName();
  }, );

  const logout = async () => {
    try {
      await window.api.deleteStore('user_info');
      setUserName(undefined);
    } catch (error) {
      console.log(error);
    };
  };
  
    const [data, setData] = useState<any>(null);

  const login = async (): Promise<void> => {
    await window.api.openLogin();
  };

  const loadData = async (): Promise<void> => {
    const result = await window.api.getData();
    setData(result);
  };
  

  return (
    <>
      <div className={styles.main_wrapper}>
        <div className={styles.header}>
          {/* <div className="link_box">
            <a href="" >Играть</a>
            <div className="page-indicator page-active"></div>
          </div>
          <div className="link_box">
            <a href="">Установки</a>
            <div className="page-indicator page-deactive"></div>
          </div>
          <div className="link_box">
            <a href="">Моды</a>
            <div className="page-indicator page-deactive"></div>
          </div>
          <div className="link_box">
            <a href="">Настройки</a>
            <div className="page-indicator page-deactive"></div>
          </div> */}
        </div>



        <div className={styles.body}>
              <div>
      <button onClick={login}>Войти</button>
      <button onClick={loadData}>Получить данные</button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
          
        </div>



        <div className={styles.basement}>
          <select name="installations" id="" className={styles.installations}>
            <option value="">1.21.10</option>
            <option value="">1.20.0</option>
            <option value="">1.19.0</option>
          </select>

          <div className={styles.play}>
            <button className={styles.play_btn}>play</button>
            {/* <img src={img} alt="" /> */}
          </div>

          {userName ? <div>{userName} <button onClick={() => logout()}>log out</button></div> : <Link to='/auth'>Authorize</Link>}
        </div>
      </div>
    </>
  )
}

export default Home
