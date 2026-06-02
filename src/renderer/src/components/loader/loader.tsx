import styles from "./loader.module.css"

interface LoaderProps {
    scale?: string | number;
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

function Loader({ scale = "1", fontSize = "48px"}: LoaderProps): React.JSX.Element {
    return(
        <div className={styles.loader_wrapper} style={{scale}}>
            <div className={styles.loader} style={{ fontSize }}>L &nbsp; ading</div>
        </div>
    )
}

export default Loader