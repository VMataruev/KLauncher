import { useEffect } from "react"
import { notificationList, addNotification }  from "../../overlay/notification/features/notificationList"

function Settings(): React.JSX.Element {
  
  useEffect(() => {
    
    addNotification({status:"error", msg: "test"})
  }, [])
  

  return (
    <>
        <div>Settings</div>
    </>
  )
}

export default Settings