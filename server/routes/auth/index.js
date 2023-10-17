import express from 'express'
import { activeUser, banUser, deleteUser, userLogin } from './auth'

const router = express.Router()

router.post('/login', userLogin)
router.delete('/delete', deleteUser)
router.post('/ban', banUser)
router.post('/active', activeUser)

export default router
