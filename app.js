const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// Stream function to write error logs
const writeErrorLogs = fs.createWriteStream(`${__dirname}/logs/errorlogs.log`, {flags: 'a'});

// Middleware to only write logs if response status is 400 or above
app.use(morgan('combined', {
  skip: (req, res) => {return res.statusCode < 400},
  stream: writeErrorLogs
}));

app.use(express.json());
app.use((req, res, next) => {
  req.requested_at = new Date().toISOString();

  next();
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/**
 * ================================================================================
 * ROUTE HANDLERS
 * ================================================================================
 */

// Tours
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

// Users
const getUsers = (req, res) => {
  return res.status(500)
            . json({
              message: 'This route is not yet available.'
            });
};
const createUsers = (req, res) => {
  return res.status(500)
            . json({
              message: 'This route is not yet available.'
            });
};
const patchUsers = (req, res) => {
  return res.status(500)
            . json({
              message: 'This route is not yet available.'
            });
};
const deleteUsers = (req, res) => {
  return res.status(500)
            . json({
              message: 'This route is not yet available.'
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

const toursRouter = express.Router();
const usersRouter = express.Router();

toursRouter.route('/')
    .post(createTours);

toursRouter.route('/:id?')
    .get(getTours)
    .patch(patchTours)
    .delete(deleteTours);

usersRouter.route('/')
    .post(createUsers);

usersRouter.route('/:id?')
    .get(getUsers)
    .patch(patchUsers)
    .delete(deleteUsers);

app.use(`${routePrefix}/tours`, toursRouter);
app.use(`${routePrefix}/users`, usersRouter);

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