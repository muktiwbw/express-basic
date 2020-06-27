const Environment = require('./app/config/env');
const app = require('./app/app');

const env = new Environment;

app.listen(env.appPort, () => {
  console.log( `Running on ${env.appEnv} environment...`);
  console.log( `Listening to port ${env.appPort}...`);
});