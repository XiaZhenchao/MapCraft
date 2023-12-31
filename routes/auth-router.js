const express = require('express')

const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)
router.post('/forgot-password', AuthController.forgotPassword);
router.put('/reset-password', AuthController.resetPassword)
router.post('/banUser', AuthController.banUserByEmail);

module.exports = router