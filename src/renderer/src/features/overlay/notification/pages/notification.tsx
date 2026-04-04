import { useEffect, useState } from "react"
import styles from "../styles/msg.module.css"
import {
    type MyNotification,
    subscribe,
    removeNotification
}  from "../features/notificationList"

function Notifications(): React.JSX.Element {
    const [notifications, setNotifications] = useState<MyNotification[]>([]);

    useEffect(() => {
        const unsubscribe = subscribe((newNotifications) => {
            setNotifications(newNotifications);
        });

        return unsubscribe;
    }, []);
    
    return (
        <div className={styles.overlay_main}>
            <div className={styles.notification_box_all}>
                {notifications.length > 0 ? 
                    notifications.map(notification => (
                    <div className={styles.notification_box} key={notification.id}>
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