import express from 'express'
const router = express.Router()
import userController from '../controllers/userController'

router.post('/register', userController.register)
router.post('/login', userController.login)


export default router