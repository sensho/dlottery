import { walletModel } from "../../schemas/user"
import { sendErrorResponse, sendSuccessResponse } from "../../utils/common"

const userLogin = async (req, res) => {
    try {
        const if_user = await walletModel.findOne({ 'wallet_id': req.body.walletId })
        if (!if_user) {
            const user = new walletModel({
                wallet_id: req.body.walletId
            })
            user.save((error, data) => {
                if (error)
                    return sendErrorResponse(res, error)
                sendSuccessResponse(res, "user created")
            })
        }
        else {
            sendSuccessResponse(res, "user fetched")
        }
    }
    catch (err) {
        console.log('err -- ', err)
    }
}

const deleteUser = (req, res) => {
    try {
        walletModel.findByIdAndDelete(req.decoded.user, (error, data) => {
            if (error)
                return sendErrorResponse(res, error)

            sendSuccessResponse(res, "user deleted")
        })
    }
    catch (err) {
        console.log(err)
    }
}

const banUser = (req, res) => {
    try {
        walletModel.findByIdAndUpdate(req.decoded.user,
            { active: false }, (error, data) => {
                if (err)
                    return sendErrorResponse(res, error)

                sendSuccessResponse(res, "user banned")
            })
    }
    catch (err) {
        console.log(err)
    }
}

const activeUser = (req, res) => {
    try {
        walletModel.findByIdAndUpdate(req.decoded.user,
            { active: true }, (err, data) => {
                if (error)
                    return sendErrorResponse(res, error)

                sendSuccessResponse(res, "user banned")
            })
    }
    catch (err) {
        console.log(err)
    }
}

export { userLogin, deleteUser, activeUser, banUser }