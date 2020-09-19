const SimpleNodeLogger = require('simple-node-logger');

const options = {
  logFilePath: './logs.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
};

const log = SimpleNodeLogger.createSimpleLogger(options);

export default log;
