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
}

module.exports = new TourController();