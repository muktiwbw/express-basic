const Router = require('./../config/router');
const ReviewController = require('../controllers/reviewController');

class ReviewRouter extends Router {
  constructor() {
    super({ mergeParams: true });
    
    this.router.route('/')
        .post(ReviewController.createReviews.bind(ReviewController))
        .get(ReviewController.getAllReviews.bind(ReviewController));
    this.router.route('/:id')
        .get(ReviewController.getOneReview.bind(ReviewController))
        .delete(ReviewController.deleteReviews.bind(ReviewController))
        .patch(ReviewController.updateReviews.bind(ReviewController));
    
  }
}

module.exports = new ReviewRouter().router;