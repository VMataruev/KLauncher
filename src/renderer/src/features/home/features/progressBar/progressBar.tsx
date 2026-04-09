import { useState } from 'react'
import styles from './progressBar.module.css'

function ProgressBar({progress}): React.JSX.Element {

    return(
        <div className={styles.progressBar}>
            <div className={styles.bar}>
                <div className={styles.bar_complete} style={{ width: `${progress}%` }}></div>
                <div className={styles.text_info}>Downloading: {progress}%</div>
            </div>
        </div>
    )
}

export default ProgressBar