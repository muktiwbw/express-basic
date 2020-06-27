const express = require('express');
const TourController = require('./../controllers/tourController');
const TourMiddleware = require('./../middlewares/tourMiddleware');
const CommonMiddleware = require('./../middlewares/__commonMiddleware');

const router = express.Router();

/** =================================================================
 * COMMONLY USED ENDPOINTS
 * ==================================================================
 * 
 * 
 */

router.route('/top-three-tours-by-rating')
    .get(
        TourMiddleware.topThreeToursByRating,
        CommonMiddleware.querySeparator,
        TourController.getTours
    );

/** 
 * 
 * COMMONLY USED ENDPOINTS
 * ==================================================================
*/

router.route('/')
    .post(TourController.createTours);

router.route('/:id?')
    .get(CommonMiddleware.querySeparator, TourController.getTours)
    .patch(TourController.patchTours)
    .delete(TourController.deleteTours);

module.exports = router;