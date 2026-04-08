import { ipcMain } from "electron";
import axios from "axios";

ipcMain.handle('get-request', async (_event, url: string) => {
    try {
        const res = await axios.get(url);
        // console.log(res.data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                return {
                    success: false, 
                    error: 'Нет соединения с интернетом. Проверьте подключение.' 
                };
            } else if (error.response) {
                // Сервер вернул ошибку (404, 500 и т.д.)
                return { 
                    success: false, 
                    error: `Ошибка сервера (${error.response.status}): ${error.response.statusText}` 
                };
            } else if (error.request) {
                // Запрос был сделан, но нет ответа
                return { 
                    success: false, 
                    error: 'Сервер не отвечает. Попробуйте позже.' 
                };
            }
        }

        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
        };
    }
});