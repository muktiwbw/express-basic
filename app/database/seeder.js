const fs = require('fs');

const TourModel = require('./../models/tourModel');
const Tour = new TourModel().model;

const seed = async () => {
  const seeds = JSON.parse(fs.readFileSync(`${__dirname}/seeds.json`, {encoding: 'utf-8'}));

  try {
    /**
     * Add more model here...
     */
    await Tour.create(seeds.tour);
    // await ModelName.create(seeds.modelname);
    
    /**==================================================== */

    console.log('Data successfully seeded!');
  } catch (error) {
    console.log(error);
  }
  
  process.exit();
}

const scoop = async () => {
  try {
    /**
     * Add more model here...
     */
    await Tour.deleteMany();
    // await ModelName.deleteMany();

    /**================================================== */

    console.log('Data successfully scooped!');
  } catch (error) {
    console.log(error);
  }

  process.exit();
}

if (process.argv[2] === 'seed') {
  seed();
} else if (process.argv[2] === 'scoop') {
  scoop();
} else {
  console.log(`Invalid flag: ${process.argv[2]}`);
  process.exit();
}