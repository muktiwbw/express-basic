const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.route('/')
    .post(tourController.createTours);

router.route('/:id?')
    .get(tourController.getTours)
    .patch(tourController.patchTours)
    .delete(tourController.deleteTours);

module.exports = router;