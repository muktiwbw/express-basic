const Environment = require('./app/config/env');
const Application = require('./app/app');

const env = new Environment;
const app = new Application().app;

app.listen(env.appPort, () => {
  console.log( `Running on ${env.appEnv} environment...`);
  console.log( `Listening to port ${env.appPort}...`);
});