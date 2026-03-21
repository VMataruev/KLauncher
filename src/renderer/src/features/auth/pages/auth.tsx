import { useState } from "react"
import styles from "../styles/auth.module.css"
import { useNavigate } from "react-router-dom";

function Auth(): React.JSX.Element {

  const navigate = useNavigate();

  const [ email, setEmail ] = useState<string>();
  const [ password, setPassword ] = useState<string>();

  const doRequest = async () => {
    // { email: string; password: string; twofacode?: string; preEmailToken?: string }

    if (!email || !password) {
      console.log('Login and password required')
      return;
    }

    const body = {
      email: email,
      password: password
    };

    const url = "https://auth3.vintagestory.at/v2/gamelogin";

    try {
      await window.api.login(url, body);
      navigate('/')
    } catch (error) {
      console.log(error);
    }

  }

  const [ isCheckPassword, setIsCheckPassword ] = useState<boolean>(false);

  return(
    <>
      <div className={styles.main_wrapper}>
        <div>Email</div>
        <input type="text" name="" id="" onChange={(e) => {setEmail(e.target.value)}} />
        <div>Password</div>
        <div className={styles.password_box}>
          <input type={isCheckPassword ? "text" : "password"} name="" id="" onChange={(e) => {setPassword(e.target.value)}} />
          <button className="" onClick={() => setIsCheckPassword(!isCheckPassword)}>see password</button>
        </div>
        <button onClick={doRequest}>Auth</button>
      </div>
    </>
  )
}

export default Auth