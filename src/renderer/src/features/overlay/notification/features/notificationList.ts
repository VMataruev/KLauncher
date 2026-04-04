type MyNotification = {
    id: string,
    status: string,
    msg: string
}

let notificationList: MyNotification[] = []

const listeners = new Set<(notifications: MyNotification[]) => void>();

const notify = () => {
    const copy = [...notificationList];
    listeners.forEach((listener) => listener(copy));
};

const subscribe = (listener: (notifications: MyNotification[]) => void) => {
    listeners.add(listener);
    listener([...notificationList]);

    return () => {
        listeners.delete(listener);
    };
};

const addNotification = (
    notification: Omit<MyNotification, "id">,
    duration = 5000
) => {
    const newNotification: MyNotification = {
        id: crypto.randomUUID(),
        ...notification
    };

    notificationList = [...notificationList, newNotification];
    notify();

    setTimeout(() => {
        removeNotification(newNotification.id);
    }, duration);

    return newNotification.id;
};

const removeNotification = (id: string) => {
    notificationList = notificationList.filter((notification) => notification.id !== id);
    notify();
};

export {
    type MyNotification,
    subscribe,
    addNotification,
    removeNotification
};