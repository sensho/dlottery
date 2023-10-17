import { getRequest, postRequest } from "."
import API_ROUTES from "../config/api_routes"
import { DEV_SERVER } from "../config/constants"

const createNewGame = async (players: string, name: string, amount: string) => {
    const body = {
        wallet: localStorage.getItem("account"),
        amount,
        name,
        players
    }
    const data = await postRequest(DEV_SERVER + API_ROUTES.CREATE_GAME, body)
    return data
}

const showActiveGames = async () => {
    const data = await getRequest(DEV_SERVER + API_ROUTES.SHOW_ACTIVE_GAMES + '?wallet=' + localStorage.getItem("account"))
    return data
}

const userJoinGame = async (game_id: string) => {
    const body = {
        game_id,
        wallet: localStorage.getItem("account")
    }
    const data = await postRequest(DEV_SERVER + API_ROUTES.JOIN_GAME, body)
    return data
}

const finishGame = async (gameId: string, blockHash: string, wallet: string) => {
    const body = {
        gameId,
        wallet,
        blockHash,
        user: localStorage.getItem("account")
    }
    const data = await postRequest(DEV_SERVER + API_ROUTES.FINISH_GAME, body)
    return data
}

const getUnSeenGames = async () => {
    const data = await getRequest(DEV_SERVER + API_ROUTES.UNSEEN_GAMES + '?wallet=' + localStorage.getItem("account"))
    return data
}

const unSeenView = async(game_id: string) => {
    const body = {
        game_id,
        wallet: localStorage.getItem("account")
    }
    const data = await postRequest(DEV_SERVER + API_ROUTES.VIEW_UNSEEN_GAMES, body)
    return data
}

export { createNewGame, showActiveGames, userJoinGame, finishGame, getUnSeenGames,unSeenView }