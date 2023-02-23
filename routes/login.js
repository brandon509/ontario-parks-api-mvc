const express = require('express')
const router = express.Router()
const loginController = require('../controllers/login')

router.get('/', loginController.loginPage)
router.post('/account', loginController.account)
router.post('/register', loginController.register)

module.exports = router