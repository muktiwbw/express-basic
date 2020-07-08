const Controller = require('./../config/controller');
const Review = require('../models/reviewModel');

class ReviewController extends Controller {
  constructor() {
    super();
  }

  getAllReviews(req, res, next) {
    this.getAll(Review, req, res, next);
  }

  getOneReview(req, res, next) {
    this.getOne(Review, req, res, next);
  }

  createReviews(req, res, next) {
    req.body.tour = req.body.tour || req.params.tourId;
    req.body.user = req.body.user || req.user._id;
    
    this.createOne(Review, req, res, next);
  }

  updateReviews(req, res, next) {
    this.updateOne(Review, req, res, next);
  }

  deleteReviews(req, res, next) {
    this.deleteOne(Review, req, res, next);
  }
}

module.exports = new ReviewController();