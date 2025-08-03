const express = require('express');
const router = express.Router();
const volumeController = require('../Controller/volume');

router.get('/list_volume', volumeController.getAllVolume);
router.get('/list_volume/:id', volumeController.getVolumeById);
router.post('/create_volume', volumeController.createVolume);
router.put('/update_volume/:id', volumeController.updateVolume);
router.delete('/delete_volume/:id', volumeController.deleteVolume);

module.exports = router;
