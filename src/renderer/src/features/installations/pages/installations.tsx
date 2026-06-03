import styles from '../styles/styles.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { addNotification } from '@renderer/features/overlay/notification/features/notificationList';
import iconOptions from '@renderer/components/Installation_icons';
import { MoreHoriz } from 'iconoir-react';
import { v4 as uuidv4 } from 'uuid';
import { Clock } from "iconoir-react";
import { Wrench } from "iconoir-react";

function Installations(): React.JSX.Element {
  const navigate = useNavigate();

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

    // if no installations with same version - delete version
    let hasSameVersion = false;
    for (const installation_ of Object.values(installations)) {
      if ((installation.version == installation_.version) && (installation.id != installation_.id)) {
        hasSameVersion = true;
        break;
      };
    };
    if (!hasSameVersion) {
      const versionsFolder = await window.api.getStore("VS_versions");
      const cleanedVersion = installation.version.slice(1);
      await window.api.deleteFolder(`${versionsFolder}\\${cleanedVersion}`);
    }
    // =====================

    setInstallations(prev => {
        const updated = { ...prev };
        delete updated[installationID];
        return updated;
    });

    addNotification({status: "success", msg: "Installations deleted successfully"})
  };


  const createInstallationCopy = async (installation) => {
    const newID = uuidv4();
    const copyName = `${installation.name}-copy`;
    const copyFolder = `${installation.folder}-copy`;
    const copyInstallation = {
      ...installation,
      id: newID,
      name: copyName,
      folder: copyFolder,
      time_played: 0
    }

    const nameLength = installation.name.length;
    if (nameLength >= 45) {
      addNotification({
        status: "error",
        msg: "Cannot copy. The name would be too long"
      });
      return;
    }

    // check if copy already created
    const installations = await window.api.getStore('installations');
    
    // Проверяем, существует ли уже установка с таким именем
    const isNameExists = Object.values(installations).some(
        (inst: any) => inst.name === copyName
    );
    
    if (isNameExists) {
        setMoreBtnId("")
        addNotification({
            status: "error", 
            msg: `Installation with name "${copyName}" already exists`
        });
        return;
    }
    
    // Сохраняем новую установку
    await window.api.setStore(`installations.${newID}`, copyInstallation);

    setMoreBtnId("");
    addNotification({status: "success", msg: `${copyName} created`})

    const installationsFolder = await window.api.getStore('installationsFolder');
    await window.api.createFolder(`${installationsFolder}/${copyName}`, copyName);
    await window.api.copyFiles(`${installation.folder}`, `${installationsFolder}/${copyName}`);

    setInstallations(prev => ({
      ...prev,
      [newID]: copyInstallation
    }))
  }

  const [ isOverlayDeleteOpen, setIsOverlayDeleteOpen ] = useState<boolean>(false);
  const [ installationIDToDelete, setInstallationIDToDelete ] = useState<string>("");
  const [ installationIDToDeleteName, setInstallationIDToDeleteName ] = useState<string>("");
  const openDeleteOverlay = () => {
      setIsOverlayDeleteOpen(!isOverlayDeleteOpen);
  };
  

  return (
    <>
        <div className={styles.page_wrapper}>

          <div className={styles.new_install}>
            <Link className={styles.new_install_button} to="/Made_installation">New installation</Link>
          </div>

          <div className={styles.installs}>

            { Object.values(installations).length != 0 ?
              Object.values(installations).map((installation, index) => (
                <div className={styles.install} style={{ animationDelay: `${index * 0.06}s` }}>
                  <div className={styles.left_box}>
                    
                    <img src={getInstallationIcon(installation.img)} alt="" className={styles.img}/>
                    <div className={styles.name_verison_box}>
                      <div className={styles.name}>{installation.name}</div>
                      <div className={styles.installation_info_box}>
                            <div className={styles.version}>{installation.version}</div>
                            <div className={styles.card_version_icon_box}><Clock className={styles.card_version_icon}></Clock>
                            {installation.time_played >= 60 ? `${(installation.time_played / 60).toFixed(1)}h` : `${installation.time_played}m`}
                            </div>
                            {!(installation.mods.length > 0) ? <></> : <div className={styles.card_version_icon_box}><Wrench className={styles.card_version_icon}></Wrench><div className={styles.card_version}>{installation.mods.length}</div></div>}
                        </div>
                    </div>
                  </div>
                  <div className={styles.right_box}>
                    {/* TODO: придумать что-то с кнопкой запуска инсталяции либо другие кнопки вставить какие-нибудь */}
                    {/* <button className={`${styles.installation_button} ${styles.installation_button_play}`}>Play</button> */}
                    {/* <PlayButton></PlayButton> */}
                    <button className={styles.installation_button} onClick={() => openFolder(installation.folder)}>Folder</button>

                    <div className={styles.installation_button_more_box}>
                      <button id='btn_more' className={styles.installation_button}
                        onClick={() => {setIdForBtn(prev => prev === installation.id ? null : installation.id)}}
                      ><MoreHoriz></MoreHoriz></button>
                      <div className={`${styles.installation_button_buttons_box} ${moreBtnId == installation.id ? styles.installation_button_buttons_box_visible : <></>}`}>
                        <button className={styles.more_button} onClick={() => navigate(`/installation_settings/${installation.id}`)}>Settings</button>
                        <button className={styles.more_button} onClick={() => createInstallationCopy(installation)}>Copy</button>
                        <button className={`${styles.more_button} ${styles.more_button_danger}`} onClick={() => {
                          setInstallationIDToDelete(installation.id); 
                          openDeleteOverlay(); 
                          setInstallationIDToDeleteName(installation.name); 
                          setIdForBtn(null);
                        }}>Delete</button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              ))
              : 
              <>
                <div className={styles.no_installations_box}>
                  <div>No installations</div>
                </div>
              </>
            }

          </div>

        </div>

        {!isOverlayDeleteOpen ? <></> : 
            <div className={styles.delete_installation_overlay} onClick={() => {openDeleteOverlay()}}>
                <div className={styles.delete_installation_overlay_box} onClick={(e) => {e.stopPropagation()}}>
                  <div className={styles.delete_installation_overlay_header}>Are you sure you want to delete "{installationIDToDeleteName}"?</div>
                  <div className={styles.delete_installation_overlay_btns_box}>
                    <div className={styles.delete_installation_overlay_btn} onClick={() => {openDeleteOverlay()}}>Cancel</div>
                    <div className={styles.delete_installation_overlay_btn_primary} onClick={() => {deleteInstallation(installationIDToDelete); openDeleteOverlay()}}>Delete</div>
                  </div>
                </div>
            </div>
        }
    </>
  )
}

export default Installations