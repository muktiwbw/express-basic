const Environment = require('./app/config/env');
const Application = require('./app/app');

Application.listen(Environment.appPort, () => {
  console.log( `Running on ${Environment.appEnv} environment...`);
  console.log( `Listening to port ${Environment.appPort}...`);
});