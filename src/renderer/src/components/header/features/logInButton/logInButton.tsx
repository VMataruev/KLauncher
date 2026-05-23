import { useEffect, useState } from "react";
import styles from "./logInButton.module.css"
import { User as UserIcon } from "iconoir-react";

function LogInButton(): React.JSX.Element {
    // const [ isLogged, setIsLogged ] = useState<boolean>(false);
    const [ userName, setUserName ] = useState<string>("");

    // Old method to see if user logged via cookies
    // useEffect(() => {
    //     const getCookies = async () => {
    //         const cookies = await window.api.getCookies();
    //         for (const cookie of cookies) {
    //             const cookie_name = cookie.name;
    //             const cookie_expireDate = new Date(cookie.expirationDate * 1000);
    //             const now = new Date();
    //             // if (cookie_name == "vs_websessionkey" && cookie_expireDate > now) {
    //             //     setIsLogged(true);
    //             // }
    //         };
    //     }
    //     getCookies();
    // }, [])
    
    useEffect(() => {
        const getUserName = async () => {
            const res = await window.api.getUserName();
            // console.log(res);
            setUserName(res.name);
        }
        getUserName();
    })


    const logIn = async () => {
        try {
            await window.api.openLogin()
        } catch (error) {
            console.log(error);
        }
    }

    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    return(
        <>
            {userName != "" && userName != undefined ? 
                <div className={styles.wrapper}>
                    <div className={styles.logInBox} onClick={() => {setIsOpen(!isOpen)}}>
                        <UserIcon></UserIcon>
                        <div className={styles.logInBtn}>{userName}</div>
                    </div>
                    <div className={`${styles.drop} ${isOpen ? styles.open : styles.closed}`} onClick={() => {logIn(); setIsOpen(!isOpen)}}>Open profile</div>
                </div>
            :
                <div className={styles.wrapper}>
                    <div className={styles.logInBox} onClick={logIn}>
                        <UserIcon></UserIcon>
                        <div className={styles.logInBtn}>Log In</div>
                    </div>
                </div>
            }
        </>
    )
}

export default LogInButton