const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router.route('/')
    .post(userController.createUsers);

router.route('/:id?')
    .get(userController.getUsers)
    .patch(userController.patchUsers)
    .delete(userController.deleteUsers);
    
module.exports = router;