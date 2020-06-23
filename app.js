const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json())
app.use((req, res, next) => {
  req.requested_at = new Date().toISOString();

  next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/**
 * ================================================================================
 * ROUTE HANDLERS
 * ================================================================================
 */

const getTours = (req, res) => {
  console.log(req.requested_at);

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

    if (!tour) {
      return res.status(404)
              .json({
                app: 'Natours',
                version: '1.0.0',
                status: 'not-found',
                message: 'Data not found.'
              });
    }

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
const createTours = (req, res) => {
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
const patchTours = (req, res) => {
  const tour = tours.find(el => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404)
              .json({
                app: 'Natours',
                version: '1.0.0',
                status: 'not-found',
                message: 'Data not found.'
              });
  };

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
const deleteTours = (req, res) => {
  const tour = tours.find(el => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404)
              .json({
                app: 'Natours',
                version: '1.0.0',
                status: 'not-found',
                message: 'Data not found.'
              });
  };

  // Delete logic here...

  return res.status(204)
            .json({
              app: 'Natours',
              version: '1.0.0',
              status: 'deleted',
              tour: tour
            });
};

/**
 * ================================================================================
 * END ROUTE HANDLERS
 * ================================================================================
 */

/**
 * ================================================================================
 * ROUTES
 * ================================================================================
 */
const routePrefix = '/api/v1';

app.route(`${routePrefix}/tours`)
    .post(createTours);

app.route(`${routePrefix}/tours/:id?`)
    .get(getTours)
    .patch(patchTours)
    .delete(deleteTours);

/**
 * ================================================================================
 * END ROUTES
 * ================================================================================
 */

// Start server
const port = 3000;
app.listen(port, () => {
  console.log( `Listening to port ${port}...`);
});