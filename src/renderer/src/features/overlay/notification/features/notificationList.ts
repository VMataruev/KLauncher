type MyNotification = {
    status: string,
    msg: string
}

let notificationList: MyNotification[] = []

const addNotification = (notification: MyNotification) => {
    notificationList.push(notification);
    console.log(notificationList);
}

export {notificationList, addNotification}