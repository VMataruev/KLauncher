import { useEffect, useState } from "react";

function LogInButton(): React.JSX.Element {
    const [ isLogged, setIsLogged ] = useState<boolean>(false);

    useEffect(() => {
        const getCookies = async () => {
            const cookies = await window.api.getCookies();
            for (const cookie of cookies) {
                const cookie_name = cookie.name;
                const cookie_expireDate = new Date(cookie.expirationDate * 1000);
                const now = new Date();
                if (cookie_name == "vs_websessionkey" && cookie_expireDate > now) {
                    setIsLogged(true);
                }
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
            {isLogged ? <>Logged</> :
                <button onClick={logIn}>Log In</button>
            }
        </>
    )
}

export default LogInButton