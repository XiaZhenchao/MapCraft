/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
*/
const express = require('express')
const MapController = require('../controllers/map-controller')
const router = express.Router()
const auth = require('../auth')
router.use(auth.verify)
router.post('/map',  MapController.createMap)
router.delete('/map/:id', MapController.deleteMap)
router.get('/map/:id', MapController.getMapById)
router.get('/mapairs',  MapController.getMapPairs)
router.get('/mapList', MapController.getMapList)
router.put('/map/:id',  MapController.updateMapById)
module.exports = router