const Controller = require('../config/controller');
const Tour = require('./../models/tourModel');

const { AppError } = require('./../utils/errorHandler');

class TourController extends Controller{
  constructor() {
    super();
  }

  /**
   * * WRAPPING RESOURCE WITH CATCH FUNCTION
   * * So that it any async rejection can be caught
   */

  getTours(req, res, next) {
    const fn = async (req, res, next) => {
      if (!req.params.id) {
        const tours = await this.displayByQueryString(Tour, req.filterQuery, req.extraQuery);

        return res.status(200)
                  .json({
                    status: 'success',
                    result: tours.length,
                    data: {
                      tours: tours
                    }
                  });
      } else {
        const tour = await Tour.findById(req.params.id);

        if (!tour) { return next(new AppError('Tour doesn\'t exist', 404)); }

        return res.status(200)
                  .json({
                    status: 'success',
                    data: {
                      tour: tour
                    }
                  });
      }
    };

    this.catchAsync(fn, req, res, next);
  }

  createTours(req, res, next) {
    const fn = async (req, res, next) => {
      const tour = await Tour.create(req.body);
    
      return res.status(201)
                .json({
                  status: 'created',
                  data: {
                    tour: tour
                  }
                });
    };

    this.catchAsync(fn, req, res, next);
  }

  patchTours (req, res, next) {
    const fn = async (req, res, next) => {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
      if (!tour) { return next(new AppError('Tour doesn\'t exist', 404)); }

      return res.status(201)
                .json({
                  status: 'updated',
                  data: {
                    tour: tour
                  }
                });
    };
    
    this.catchAsync(fn, req, res, next);
  }

  deleteTours(req, res, next) {
    const fn = async (req, res, next) => {
      const tour = await Tour.findByIdAndDelete(req.params.id);
  
      if (!tour) { return next(new AppError('Tour doesn\'t exist', 404)); }
  
      return res.status(204)
                .json({
                  status: 'deleted',
                  data: {
                    tour: tour
                  }
                });
    };

    this.catchAsync(fn, req, res, next);
  }

  getTourStats(req, res, next) {
    const fn = async (req, res, next) => {
      const agg = [
        {
          $match: { ratingAverage: { $gte: 4.7 } }
        },
        {
          $group: {
            _id: '$ratingAverage',
            totalTours: { $sum: 1 },
            totalRatings: { $sum: '$ratingQuantity' },
            avgRating: { $avg: '$ratingAverage' },
            minRating: { $min: '$ratingAverage' },
            maxRating: { $max: '$ratingAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        { 
          $sort: { avgRatings: 1 } 
        }
      ];

      const tours = await Tour.aggregate(agg);

      return res.status(200)
                  .json({
                    status: 'success',
                    result: tours.length,
                    data: {
                      tours: tours
                    }
                  });
    };

    this.catchAsync(fn, req, res, next);
  }

  getMonthlyPlan(req, res, next) {
    const fn = async (req, res, next) => {
      const agg = [
        {
          $unwind: '$startDates'
        },
        {
          $addFields: {
            year: { $year: '$startDates' }, 
            month: {
              $switch: {
                branches: [
                  { case: { $eq: [ { $month: '$startDates' }, 1 ] }, then: 'January' },
                  { case: { $eq: [ { $month: '$startDates' }, 2 ] }, then: 'Fabruary' },
                  { case: { $eq: [ { $month: '$startDates' }, 3 ] }, then: 'March' },
                  { case: { $eq: [ { $month: '$startDates' }, 4 ] }, then: 'April' },
                  { case: { $eq: [ { $month: '$startDates' }, 5 ] }, then: 'May' },
                  { case: { $eq: [ { $month: '$startDates' }, 6 ] }, then: 'June' },
                  { case: { $eq: [ { $month: '$startDates' }, 7 ] }, then: 'July' },
                  { case: { $eq: [ { $month: '$startDates' }, 8 ] }, then: 'August' },
                  { case: { $eq: [ { $month: '$startDates' }, 9 ] }, then: 'September' },
                  { case: { $eq: [ { $month: '$startDates' }, 10 ] }, then: 'October' },
                  { case: { $eq: [ { $month: '$startDates' }, 11 ] }, then: 'November' },
                  { case: { $eq: [ { $month: '$startDates' }, 12 ] }, then: 'December' }
                ],
                default: 'None'
              }
            } 
          }
        },
        {
          $group: {
            _id: { 
              year: '$year',
              month: '$month'
            },
            monthlyPlans: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { year: '$_id.year', month: '$_id.month' }
        },
        {
          $sort: { '_id.year': 1, '_id.monthIndex': 1 }
        },
        {
          $project: { '_id': 0 }
        }
      ];

      const plans = await Tour.aggregate(agg);

      return res.status(200)
                  .json({
                    status: 'success',
                    result: plans.length,
                    data: {
                      plans: plans
                    }
                  });
    };
    
    this.catchAsync(fn, req, res, next);
  }
}

module.exports = new TourController();