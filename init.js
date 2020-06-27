const env = require('./app/config/env');
const app = require('./app/app');

app.listen(env.appPort, () => {
  console.log( `Running on ${env.appEnv} environment...`);
  console.log( `Listening to port ${env.appPort}...`);
});