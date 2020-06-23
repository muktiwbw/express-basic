const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`));

exports.checkIfExistsById = (req, res, next, val) => {
  const tour = tours.find(el => el.id === parseInt(val))

  if (!tour) {
    return res.status(404)
            .json({
              app: 'Natours',
              version: '1.0.0',
              status: 'not-found',
              message: 'Data not found.'
            });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!(req.body.name && req.body.price)) {
    return res.status(400)
            .json({
              app: 'Natours',
              version: '1.0.0',
              status: 'bad-request',
              message: 'Missing body request of name or price.'
            });
  }

  next();
}