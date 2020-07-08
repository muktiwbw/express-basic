const Router = require('./../config/router');
const TourController = require('../controllers/tourController');
const TourMiddleware = require('../middlewares/tourMiddleware');
const AuthMiddleware = require('../middlewares/authMiddleware');
const reviewRouter = require('./reviewRouter');

class TourRouter extends Router {
  constructor() {
    super();    
    /** =================================================================
     * COMMONLY USED ENDPOINTS
     * ==================================================================
     * 
     * Little note:
     *  When parsing a class method, make sure to use bind() to bind the class instance.
     *  This way, the class will be initialized first (sort of).
     *  If not, the method will be parsed alone, means that it doesn't know
     *  the other methods and attributes in its class.
     *  This resolves the common problem of "this" resulting undefined. 
     */
    
    this.router.route('/top-three-tours-by-rating')
        .get(
            TourMiddleware.topThreeToursByRating.bind(TourMiddleware),
            TourMiddleware.querySeparator.bind(TourMiddleware),
            TourController.getAllTours.bind(TourController)
        );

    this.router.route('/stats')
        .get(TourController.getTourStats.bind(TourController));

    this.router.route('/monthly-plans')
        .get(TourController.getMonthlyPlan.bind(TourController));
    
    /** 
     * 
     * COMMONLY USED ENDPOINTS
     * ==================================================================
    */

    this.router.use('/:tourId/reviews', reviewRouter);
    
    this.router.route('/')
        .post(TourController.createTours.bind(TourController))
        .get(TourController.getAllTours.bind(TourController));
    
    this.router.route('/:id')
        .get(TourController.getOneTour.bind(TourController))
        .patch(TourController.patchTours.bind(TourController))
        .delete(
            AuthMiddleware.restrictedTo('admin', 'lead-guide').bind(AuthMiddleware), 
            TourController.deleteTours.bind(TourController)
        );
    
  }
}

module.exports = new TourRouter().router;