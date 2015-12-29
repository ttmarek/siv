const path = require('path');
const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: path.resolve(__dirname, '../logs/siv.log'),
    })
  ]
});

module.exports = logger;
