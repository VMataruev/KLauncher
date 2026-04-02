import styles from '../styles/styles.module.css'
import img from '../../../assets/temporal.png'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Installations(): React.JSX.Element {

  type Installation = {
    id: string;
    img: string;
    name: string;
    version: string;
    version_link: string;
    mods: string[];
    folder: string | null;
  };

  const [ installations, setInstallations ] = useState<Record<string, Installation>>({});
  useEffect(() => {
    const loadData = async () => {
      const res = await window.api.getStore("installations");
      setInstallations(res);
      console.log(res);
    };

    loadData();
  }, []);

  const openFolder = async (folderpath) => {
    console.log(folderpath);
    await window.api.openFolder(folderpath);
  }
  

  return (
    <>
        <div className={styles.page_wrapper}>

          <div className={styles.page_header}>
            <div className={styles.search}>
              <div>SEARCH</div>
              <input type="text" className={styles.search_input} />
            </div>
            <div className={styles.sort}>
              <div>sort</div>
              <select className={styles.select_input} name="" id="">
                <option value="">test</option>
              </select>
            </div>
            <div className={styles.releases}>
              <div>Releases</div>
              <div className={styles.releases_v}>
                <div className={styles.checkbox_box}>
                  <input className={styles.checkbox_style} type="checkbox" />
                  <div>Releases</div>
                </div>
                <div className={styles.checkbox_box}>
                  <input className={styles.checkbox_style} type="checkbox" />
                  <div>Snapshots</div>
                </div>
                <div className={styles.checkbox_box}>
                  <input className={styles.checkbox_style} type="checkbox" />
                  <div>Modify</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.new_install}>
            <Link className={styles.new_install_button} to="/Made_installation">New install</Link>
          </div>

          <div className={styles.installs}>

            { installations ?
              Object.values(installations).map(installation => (
                <div className={styles.install}>
                  <div className={styles.left_box}>
                    <img src={img} alt="" className={styles.img}/>
                    <div className={styles.name_verison_box}>
                      <div className={styles.name}>{installation.name}</div>
                      <div className={styles.version}>{installation.version}</div>
                    </div>
                  </div>
                  <div className={styles.right_box}>
                    <button className={`${styles.installation_button} ${styles.installation_button_play}`}>Play</button>
                    <button className={styles.installation_button} onClick={() => openFolder(installation.folder)}>Folder</button>
                    <button className={styles.installation_button}>...</button>
                  </div>
                </div>
              ))
              : <></>
            }

          </div>

        </div>
    </>
  )
}

export default Installations