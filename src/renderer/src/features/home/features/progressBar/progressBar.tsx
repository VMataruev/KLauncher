import { useEffect, useState } from 'react'
import styles from './progressBar.module.css'

function ProgressBar(): React.JSX.Element {


    const [ progressFile, setProgressFile ] = useState(0);
    const [ fileName, setFileName ] = useState("");
    useEffect(() => {
        const unsubscribe = window.api.downloadFileProgress((data) => {
            if (data.percent !== undefined) {
                setProgressFile(data.percent);
            };
            if (data.fileName !== undefined) {
                setFileName(data.fileName);
            }
        });

        return () => unsubscribe();
    }, []);
    // console.log(progressFile);

    const [ progressGameInstaller, setProgressGameInstaller ] = useState(0);
    const [ gameInstallerName, setGameInstallerName ] = useState("");
    useEffect(() => {
        const unsubscribe = window.api.downloadProgress((data) => {
            if (data.percent !== undefined) {
                setProgressGameInstaller(data.percent);
            };
            if (data.fileName !== undefined) {
                setGameInstallerName(data.fileName);
            }
        });

        return () => unsubscribe();
    }, []);
    // console.log(progressGameInstaller);


    return(
        <>  
            {((progressFile != 0 && progressFile != 100) || (progressGameInstaller != 0 && progressGameInstaller != 100)) 
                ?

                <div className={styles.progressBar}>
                    { (progressFile != 0 && progressFile != 100) ?
                    <div className={styles.bar}>
                        <div className={styles.bar_complete} style={{ width: `${progressFile}%` }}></div>
                        <div className={styles.text_info}>Downloading {fileName}: {progressFile}%</div>
                    </div>
                    :
                    <></>
                    }

                    { (progressGameInstaller != 0 && progressGameInstaller != 100) ?
                    <div className={styles.bar}>
                        <div className={styles.bar_complete} style={{ width: `${progressGameInstaller}%` }}></div>
                        <div className={styles.text_info}>Downloading {gameInstallerName}: {progressGameInstaller}%</div>
                    </div>
                    :
                    <></>
                    }
                </div>
                
                :
                <></>
            }
        </>
    )
}

export default ProgressBar