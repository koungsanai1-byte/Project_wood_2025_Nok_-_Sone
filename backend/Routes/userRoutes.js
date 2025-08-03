const express = require('express');
const router = express.Router();
const usersController = require('../Controller/userController');
const upload = require('../Uploads/upload');

router.post('/users', upload.single('image_users'), usersController.createUser);
router.get('/users', usersController.getUsers);
router.delete('/users/:id', usersController.deleteUser);

module.exports = router;
