const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

router.get('/', adminController.adminPage)
router.put('/approve', adminController.approve)
router.delete('/delete', adminController.delete)
router.post('/new-park', adminController.newPark)

module.exports = router