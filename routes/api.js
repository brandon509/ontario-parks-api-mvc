const express = require('express')
const router = express.Router()
const apiController = require('../controllers/api')

router.get('/', apiController.all)
router.get('/region/:region', apiController.region)
router.get('/park-name/:park', apiController.parkName)

module.exports = router