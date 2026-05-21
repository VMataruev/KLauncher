import styles from "./CustomSelectInstallation.module.css"

function CustomSelectInstallation({options, value}): React.JSX.Element {
    console.log("here")
    console.log(options)
    return(
        <>
            <div className={styles.select_wrapper}>
                <div className={styles.box_1}>img</div>
                <div className={styles.box_2}>
                    <div>Name</div>
                    <div>Version</div>
                </div>
            </div>
        </>
    );
}

export default CustomSelectInstallation