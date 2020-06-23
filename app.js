const fs = require('fs');
const express = require('express');
const { stringify } = require('querystring');

const app = express();
app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/**
 * ================================================================================
 * ROUTES
 * ================================================================================
 */

// Get all tours / specific tours
app.get('/api/v1/tours/:id?', (req, res) => {
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
});

// Create a tour
app.post('/api/v1/tours', (req, res) => {
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
});

// Patch a tour data
app.patch('/api/v1/tours/:id', (req, res) => {
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
});

// Delete a tour data
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

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