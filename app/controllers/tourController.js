const {Tour} = require('./../model');

exports.getTours = (req, res) => {
  res.status(200).json({
    message: 'Okay'
  });
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