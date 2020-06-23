const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`));

exports.getTours = (req, res) => {
  if (!req.params.id) {
    return res.status(200)
              .json({
                app: 'Natours',
                version: '1.0.0',
                status: 'success',
                result: tours.length,
                data: {
                  tours: tours
                }
              });
  } else {
    const tour = tours.find(el => el.id === parseInt(req.params.id));

    return res.status(200)
              .json({
                app: 'Natours',
                version: '1.0.0',
                status: 'success',
                data: {
                  tour: tour
                }
              });
  }  
};

exports.createTours = (req, res) => {
  const newTour = Object.assign({id: tours.length}, req.body);
  
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    return res.status(201)
        .json({
          app: 'Natours',
          version: '1.0.0',
          status: 'created',
          data: {
            tour: newTour
          }
        });
  });
};

exports.patchTours = (req, res) => {
  const tour = tours.find(el => el.id === parseInt(req.params.id));

  // Patch logic here...
  tour.difficulty = req.body.difficulty;

  return res.status(201)
            .json({
              app: 'Natours',
              version: '1.0.0',
              status: 'patched',
              tour: tour
            });
};

exports.deleteTours = (req, res) => {
  const tour = tours.find(el => el.id === parseInt(req.params.id));

  // Delete logic here...

  return res.status(204)
            .json({
              app: 'Natours',
              version: '1.0.0',
              status: 'deleted',
              tour: tour
            });
};