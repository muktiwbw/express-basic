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

// Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200)
  .json({
    app: 'Natours',
    version: '1.0.0',
    status: 'success',
    result: tours.length,
    data: {
      tours: tours
    }
  });
});

// Create a tour
app.post('/api/v1/tours', (req, res) => {
  const newTour = Object.assign({id: tours.length}, req.body);
  
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201)
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