import { useEffect, useState } from "react"
import styles from "../styles/msg.module.css"
import { notificationList, addNotification }  from "../features/notificationList"

function Notifications(): React.JSX.Element {
    const [ notification, setNotification ] = useState(notificationList);
    
    return (
        <div className={styles.overlay_main}>
            <div className={styles.notification_box_all}>

                {notification.length > 0 ? 
                    notification.map(notification => (
                    <div className={styles.notification_box}>
                        <div className={`${styles.notification_status} ${styles[notification.status]}`}></div>
                        <div className={styles.notification_img}></div>
                        <div className={styles.notification_text}>{notification.msg}</div>
                    </div>
                    ))
                    :
                    <></>
                }

            </div>
        </div>
    )
}

export default Notifications