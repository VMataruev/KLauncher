import styles from '../styles/styles.module.css'
import img from '../../../assets/temporal.png'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addNotification } from '@renderer/features/overlay/notification/features/notificationList';
import iconOptions from '@renderer/components/Installation_icons';

function Installations(): React.JSX.Element {
  const navigate = useNavigate();


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
    //   console.log(res);
    };

    loadData();
  }, []);

  const getInstallationIcon = (img: string) => {
    const found = iconOptions.find(icon => icon.id === img);
    return found ? found.icon : img;
  };
  console.log(installations);


  const openFolder = async (folderpath) => {
    // console.log(folderpath);
    await window.api.openFolder(folderpath);
  };

  const [ moreBtnId, setMoreBtnId ] = useState<string>("");
  const setIdForBtn = (id) => {
    setMoreBtnId(id);
  };


  const deleteInstallation = async (installationID: string) => {
    const installation = installations[installationID];
    await window.api.deleteStore(`installations.${installationID}`);
    if (installation.folder != null) {
        await window.api.deleteFolder(installation.folder);
    };
    setInstallations(prev => {
        const updated = { ...prev };
        delete updated[installationID];
        return updated;
    });
    addNotification({status: "success", msg: "Installations deleted successfully"})
  };
  

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
                    
                    <img src={getInstallationIcon(installation.img)} alt="" className={styles.img}/>
                    <div className={styles.name_verison_box}>
                      <div className={styles.name}>{installation.name}</div>
                      <div className={styles.version}>{installation.version}</div>
                    </div>
                  </div>
                  <div className={styles.right_box}>
                    <button className={`${styles.installation_button} ${styles.installation_button_play}`}>Play</button>
                    <button className={styles.installation_button} onClick={() => openFolder(installation.folder)}>Folder</button>

                    <div className={styles.installation_button_more_box}>
                      <button id='btn_more' className={styles.installation_button}
                        onClick={() => {setIdForBtn(prev => prev === installation.id ? null : installation.id)}}
                      >...</button>
                      <div className={`${styles.installation_button_buttons_box} ${moreBtnId == installation.id ? styles.installation_button_buttons_box_visible : <></>}`}>
                        <button className={styles.more_button} onClick={() => navigate(`/installation_settings/${installation.id}`)}>Settings</button>
                        <button className={styles.more_button}>Copy</button>
                        <button className={styles.more_button} onClick={() => {deleteInstallation(installation.id)}}>Delete</button>
                      </div>
                    </div>
                    
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