import express from 'express'
import { archiveGame, createGame, finishGame, getActiveGames, getNotSeenRaffle, unArchiveGame, userJoinRaffle, viewRaffle } from './raffle'

const router = express.Router()

router.post('/create', createGame)
router.post('/archive', archiveGame)
router.post('/unarchive', unArchiveGame)
router.post('/finish', finishGame)

router.get('/active', getActiveGames)
router.get('/not/seen', getNotSeenRaffle)

// raffle activities
router.post('/join', userJoinRaffle)
router.post('/view', viewRaffle)

export default router
