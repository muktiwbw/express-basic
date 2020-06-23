const env = require('./app/config/env');
const app = require('./app/app');

app.listen(env.serverPort, () => {
  console.log( `Running on ${env.nodeEnv} environment...`);
  console.log( `Listening to port ${env.serverPort}...`);
});