import { addNotification }  from "../../overlay/notification/features/notificationList"

function Settings(): React.JSX.Element {


  const testNotif = () => {
    addNotification({status:"success", msg: "Much longer text just test idk gaiduayud adada"});
    addNotification({status:"error", msg: "Much longer text just test idk gaiduayud adada"});
    addNotification({status:"warning", msg: "Much longer text just test idk gaiduayud adada"})
  }
  

  return (
    <>
        <div>Settings</div>
        <div onClick={() => testNotif()}>Test</div>
    </>
  )
}

export default Settings