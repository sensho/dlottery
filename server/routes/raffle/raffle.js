import { raffleModel } from "../../schemas/raffle"
import { walletModel } from "../../schemas/user"
import { sendErrorResponse, sendSuccessResponse } from "../../utils/common"

const createGame = async (req, res) => {
    try {
        console.log(req.body)
        const user = await walletModel.findOne({ "wallet_id": req.body.wallet })
        const if_raffle = await raffleModel.findOne({ name: req.body.name, host: user._id })
        console.log(if_raffle)
        if (if_raffle)
            return sendErrorResponse(res, "Game already exists. Please enter a new name")

        const game = new raffleModel({
            host: user._id,
            amount: req.body.amount,
            players_number: req.body.players,
            name: req.body.name
        })

        game.save(async (error, data) => {
            if (error)
                sendErrorResponse(res, error)

            user.points += 0.90;
            await user.save()
            sendSuccessResponse(res, { raffle_id: data.raffle_id, points: user.points })
        })
    }
    catch (err) {
        console.log(err)
    }
}

const archiveGame = (req, res) => {
    try {
        raffleModel.findByIdAndUpdate(req.body.raffleId, { archived: true }, (error, data) => {
            if (err)
                sendErrorResponse(res, error)

            sendSuccessResponse(res, "game archived")
        })
    }
    catch (err) {
        console.log(err)
    }
}

const unArchiveGame = (req, res) => {
    try {
        raffleModel.findByIdAndUpdate(req.body.raffleId, { archived: false }, (error, data) => {
            if (err)
                sendErrorResponse(res, error)

            sendSuccessResponse(res, "game archived")
        })
    }
    catch (err) {
        console.log(err)
    }
}

const finishGame = async (req, res) => {
    try {
        console.log('check -- ', req.body)
        const raffle = await raffleModel.findOne({ "raffle_id": req.body.gameId });
        const address = await walletModel.findOne({ "wallet_id": req.body.wallet.toLowerCase() })
        const user = await walletModel.findOne({ "wallet_id": req.body.user })
        if (raffle.participants.length === raffle.players_number) {
            raffleModel.findByIdAndUpdate(raffle._id, {
                finished: true,
                $set: {
                    blockHash: req.body.blockHash,
                    winner: address._id
                }
            }, async (error, data) => {
                if (error)
                    return sendErrorResponse(res, error)

                user.points += 0.90;
                await user.save()
                return sendSuccessResponse(res, { mesage: "game finished", points: user.points })
            })
        }
        else
            return sendErrorResponse(res, "game not full")
    }
    catch (err) {
        console.log(err)
    }
}

const getActiveGames = async (req, res) => {
    try {
        const user = await walletModel.findOne({ 'wallet_id': req.query.wallet })
        const active_games = await raffleModel.find({
            finished: false,
            participants: { $nin: [user._id] }
        }).populate("host").sort({ 'created_at': -1 });;

        const your_games = await raffleModel.find({
            finished: false,
            participants: { $in: [user._id] }
        }).populate("host").populate('participants').sort({ 'created_at': -1 });

        const your_finished_games = await raffleModel.find({
            finished: true,
            participants: { $in: [user._id] }
        }).populate("host").populate('winner').populate('participants').sort({ 'created_at': -1 });

        return sendSuccessResponse(res, {
            active_games,
            your_games,
            your_finished_games
        })

    }
    catch (err) {
        console.log(err)
    }
}



const userJoinRaffle = async (req, res) => {
    try {
        const user = await walletModel.findOne({ "wallet_id": req.body.wallet })
        raffleModel.findByIdAndUpdate(req.body.game_id, {
            $push: {
                participants: user._id
            }
        }, { new: true }, (error, data) => {
            if (error)
                return sendErrorResponse(res, error)

            console.log('data -- ', data)

            return sendSuccessResponse(res, data.participants.length)
        })
    }
    catch (err) {
        console.log(err)
    }
}

const viewRaffle = async (req, res) => {
    try {
        const user = await walletModel.findOne({ "wallet_id": req.body.wallet })
        console.log('check -- ', user, req.body)
        raffleModel.findByIdAndUpdate(req.body.game_id, {
            $push: {
                seen: user._id
            }
        }, ((error, data) => {
            if (error)
                return sendErrorResponse(res, error)

            sendSuccessResponse(res, "done")
        }))
    }
    catch (err) {
        console.log(err)
    }
}

const getNotSeenRaffle = async (req, res) => {
    try {
        const user = await walletModel.findOne({ "wallet_id": req.query.wallet })
        raffleModel.find({
            finished: true,
            participants: user._id,
            seen: { $nin: [user._id] }
        }).populate("host").populate("winner").exec((error, data) => {
            if (error)
                return sendErrorResponse(res, error)

            sendSuccessResponse(res, data)
        })
    }
    catch (err) {
        console.log(err)
    }
}

export { createGame, archiveGame, viewRaffle, getNotSeenRaffle, unArchiveGame, finishGame, getActiveGames, userJoinRaffle }