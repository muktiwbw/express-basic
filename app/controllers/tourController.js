const {Tour} = require('./../model');

exports.getTours = async (req, res) => {
  try {
    if (!req.params.id) {
      const tours = await Tour.find();

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

      if (!tour) {
        return res.status(404)
                  .json({
                    status: 'not-found',
                    message: 'Data not found'
                  });
      }

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
};

exports.createTours = async (req, res) => {
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
};

exports.patchTours = (req, res) => {
  res.status(200).json({
    message: 'Okay'
  });
};

exports.deleteTours = (req, res) => {
  res.status(200).json({
    message: 'Okay'
  });
};