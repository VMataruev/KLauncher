import { ipcMain } from "electron";
import { store } from '../store'

ipcMain.handle("vs-login", async (_event, url, body: { email: string; password: string; twofacode?: string; preLoginToken?: string }): Promise<string> => {
  const reqData = new URLSearchParams()
  reqData.append("email", body.email)
  reqData.append("password", body.password)
  reqData.append("totpcode", body.twofacode ?? "")
  reqData.append("prelogintoken", body.preLoginToken ?? "")

  const request = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: reqData
  })

  const res = await request.json()
  
  store.set('user_info', res);

  return res
})
