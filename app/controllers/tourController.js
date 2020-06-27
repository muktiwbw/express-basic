const Controller = require('../config/controller');

const Tour = require('./../models/tourModel');

const { displayByQueryString } = require('./../utils/query');

class TourController extends Controller{
  constructor() {
    super();
  }

  async getTours(req, res) {
    try {
      if (!req.params.id) {
        const tours = await displayByQueryString(Tour, req.filterQuery, req.extraQuery);
  
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
    } catch (err) {
      return res.status(500)
                .json({
                  status: 'fail',
                  message: err
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
    } catch (err) {
      return res.status(400)
                .json({
                  status: 'fail',
                  message: err
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
    } catch (err) {
      return res.status(500)
                .json({
                  status: 'fail',
                  message: err
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
    } catch (err) {
      return res.status(500)
                .json({
                  status: 'fail',
                  message: err
                });
    }
  }
}

module.exports = new TourController();