import styles from '../styles/styles.module.css'

function Made_installation(): React.JSX.Element {
    return(
        <div className={styles.page_wrapper}>
            <div className={styles.page_header}>
                <div>Installation create</div>
            </div>

            <div className={styles.page_body}>
                <div className={styles.name_box}>
                    <div className={styles.name}>Name</div>
                    <select name="" id="">
                        <option value="">img</option>
                    </select>
                </div>
                
                <div className={styles.version_box}>
                    <div className={styles.version}>Version</div>
                    <select name="" id="">
                        <option value="">version</option>
                    </select>
                </div>

                <div className={styles.mods_box}>
                    <div>mods</div>
                </div>

                <div className={styles.foler_box}>
                    <div className={styles.foler_header}>Foler</div>
                    <div className={styles.foler_box_change}>
                        <div className={styles.foler_name}>Use default folder</div>
                        <button>Observe</button>
                    </div>
                </div>
                
            </div>

            <div className={styles.page_basement}>
                <button>Cancel</button>
                <button>Install</button>
            </div>
        </div>
    )
}

export default Made_installation