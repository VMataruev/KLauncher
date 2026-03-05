import styles from '../styles/styles.module.css'
import img from '../../../assets/mod_img.jpg'
import { Link } from 'react-router-dom';

function Installations(): React.JSX.Element {

  return (
    <>
        <div className={styles.page_wrapper}>

          <div className={styles.page_header}>
            <div className={styles.search}>
              <div>Find</div>
              <input type="text" />
            </div>
            <div className={styles.sort}>
              <div>sort</div>
              <select name="" id="">
                <option value="">test</option>
              </select>
            </div>
            <div className={styles.releases}>
              <div>Releases</div>
              <div className={styles.releases_v}>
                <div className={styles.checkbox_box}>
                  <input type="checkbox" />
                  <div>Release</div>
                </div>
                <div className={styles.checkbox_box}>
                  <input type="checkbox" />
                  <div>Snapshot</div>
                </div>
                <div className={styles.checkbox_box}>
                  <input type="checkbox" />
                  <div>Modify</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.new_install}>
            <Link to="/Made_installation">New install</Link>
          </div>

          <div className={styles.installs}>
            <div className={styles.install}>
              <div className={styles.left_box}>
                <img src={img} alt="" className={styles.img}/>
                <div className={styles.name_verison_box}>
                  <div className={styles.name}>name</div>
                  <div className={styles.version}>version</div>
                </div>
              </div>
              <div className={styles.right_box}>
                <button>Play</button>
                <button>Folder</button>
                <button>More</button>
              </div>
            </div>

          </div>

        </div>
    </>
  )
}

export default Installations