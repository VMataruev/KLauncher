import img from "../../../assets/play-btn-img.png"
import styles from '../styles/style.module.css'

function Home(): React.JSX.Element {

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

          <div className="user_info">KillerBunny</div>
        </div>
      </div>
    </>
  )
}

export default Home
