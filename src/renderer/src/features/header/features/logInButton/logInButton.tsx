import { useEffect, useState } from "react";
import styles from "./logInButton.module.css"
import { User as UserIcon } from "iconoir-react";

function LogInButton(): React.JSX.Element {
    const [ isLogged, setIsLogged ] = useState<boolean>(false);

    useEffect(() => {
        const getCookies = async () => {
            const cookies = await window.api.getCookies();
            for (const cookie of cookies) {
                const cookie_name = cookie.name;
                const cookie_expireDate = new Date(cookie.expirationDate * 1000);
                const now = new Date();
                // if (cookie_name == "vs_websessionkey" && cookie_expireDate > now) {
                //     setIsLogged(true);
                // }
            };
        }
        getCookies();
    }, [])
    


    const logIn = async () => {
        try {
            await window.api.openLogin()
        } catch (error) {
            console.log(error);
        }
    }


    return(
        <>
            {isLogged ? 
                <div className={styles.logInBox}>
                    <UserIcon></UserIcon>
                    <div className={styles.logInBtn}>Logged</div>
                </div>
            :
                <div className={styles.logInBox} onClick={logIn}>
                    <UserIcon></UserIcon>
                    <div className={styles.logInBtn} >Log In</div>
                </div>
            }
        </>
    )
}

export default LogInButton