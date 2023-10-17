import express from 'express'
const router = express.Router()

import authRouter from "./auth"
import raffleRouter from "./raffle"

router.get('/', (req, res) => {
	res.status(200).send({ message: 'DLottery Service' })
})

router.use('/user', authRouter)
router.use('/raffle', raffleRouter)

export default router
