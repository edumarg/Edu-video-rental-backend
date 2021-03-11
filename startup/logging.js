const winston = require("winston"); // https://www.npmjs.com/package/winston
require("winston-mongodb"); // https://www.npmjs.com/package/winston-mongodb
require("express-async-errors"); // https://www.npmjs.com/package/express-async-errors"

function logging() {
  // catch errors
  winston.add(new winston.transports.File({ filename: "logfile.log" })); // added a loger using the winston library

  // catch unhandled exceptions
  // https://www.npmjs.com/package/winston#handling-uncaught-exceptions-with-winston
  winston.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      filename: "uncaughtExepctions.log",
      handleExceptions: true,
    })
  );

  // catch rejected promises.
  // https://www.npmjs.com/package/winston#handling-uncaught-promise-rejections-with-winston
  winston.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      filename: "rejectedPromises.log",
      handleRejections: true,
    })
  );

  // add MongoDB transport to log errors to mongoDB
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info",
    })
  );
}

module.exports = logging;
