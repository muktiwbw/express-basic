const Controller = require('../config/controller');
const Tour = require('./../models/tourModel');

class TourController extends Controller{
  constructor() {
    super();
  }

  async getTours(req, res) {
    try {
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
  
        return res.status(200)
                  .json({
                    status: 'success',
                    data: {
                      tour: tour
                    }
                  });
      }
    } catch (error) {
      
      return res.status(500)
                .json({
                  status: 'fail',
                  message: error
                });
    }
  }

  async createTours(req, res) {
    try {
      const tour = await Tour.create(req.body);
  
      return res.status(201)
                .json({
                  status: 'created',
                  data: {
                    tour: tour
                  }
                });
    } catch (error) {
      return res.status(400)
                .json({
                  status: 'fail',
                  message: error
                });
    }
  }

  async patchTours (req, res) {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      
      return res.status(201)
                .json({
                  status: 'updated',
                  data: {
                    tour: tour
                  }
                });
    } catch (error) {
      return res.status(500)
                .json({
                  status: 'fail',
                  message: error
                });
    }  
  }

  async deleteTours(req, res) {
    try {
      const tour = await Tour.findByIdAndDelete(req.params.id)
  
      return res.status(204)
                .json({
                  status: 'deleted',
                  data: {
                    tour: tour
                  }
                });
    } catch (error) {
      return res.status(500)
                .json({
                  status: 'fail',
                  message: error
                });
    }
  }

  async getTourStats(req, res) {
    try {
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
    } catch (error) {
      
      return res.status(500)
                .json({
                  status: 'fail',
                  message: error
                });
    }
  }

  async getMonthlyPlan(req, res) {
    try {
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
    } catch (error) {
      console.log(error);
      return res.status(500)
                .json({
                  status: 'fail',
                  message: error
                });
    }
  }
}

module.exports = new TourController();