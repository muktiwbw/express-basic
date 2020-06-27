const express = require('express');
const tourController = require('./../controllers/tourController');

const tourMiddleware = require('./../middlewares/tourMiddleware');
const _commonMiddleware = require('../middlewares/_commonMiddleware');

const router = express.Router();

/** =================================================================
 * COMMONLY USED ENDPOINTS
 * ==================================================================
 * 
 * 
 */

router.route('/top-three-tours-by-rating')
    .get(
        tourMiddleware.topThreeToursByRating,
        _commonMiddleware.querySeparator,
        tourController.getTours
    );

/** 
 * 
 * COMMONLY USED ENDPOINTS
 * ==================================================================
*/

router.route('/')
    .post(tourController.createTours);

router.route('/:id?')
    .get(_commonMiddleware.querySeparator, tourController.getTours)
    .patch(tourController.patchTours)
    .delete(tourController.deleteTours);

module.exports = router;