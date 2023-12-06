/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
*/
const express = require('express')
const MapController = require('../controllers/map-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
router.post('/map/:id', auth.verify, MapController.storeGeoFile)
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', MapController.getMapById)
router.get('/mapairs',  MapController.getMapPairs)
router.put('/map/:id',  MapController.updateMapById)
module.exports = router