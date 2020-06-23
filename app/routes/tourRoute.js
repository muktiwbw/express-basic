const express = require('express');
const tourController = require('./../controllers/tourController');
const tourMiddleware = require('./../middlewares/tourMiddleware');

const router = express.Router();

router.param('id', tourMiddleware.checkIfExistsById);

router.route('/')
    .post(tourMiddleware.checkBody, tourController.createTours);

router.route('/:id?')
    .get(tourController.getTours)
    .patch(tourController.patchTours)
    .delete(tourController.deleteTours);

module.exports = router;