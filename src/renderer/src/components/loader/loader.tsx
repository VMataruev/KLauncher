import styles from "./loader.module.css"

function Loader(): React.JSX.Element {
    return(
        <div className={styles.loader_wrapper}>
            <div className={styles.loader}>L &nbsp; ading</div>
        </div>
    )
}

export default Loader