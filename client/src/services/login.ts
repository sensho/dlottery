import { postRequest } from "."
import API_ROUTES from "../config/api_routes"
import { DEV_SERVER } from "../config/constants"

const loginUser = async (walletId: string) => {
    return new Promise(async(resolve, reject) => {
        const url = DEV_SERVER + API_ROUTES.USER_LOGIN
        const resp = await postRequest(url, { walletId })
        resolve(resp)
    })

}

export { loginUser }