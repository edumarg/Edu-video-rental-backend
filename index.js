const express = require("express"); // https://www.npmjs.com/package/express
require("express-async-errors"); // https://www.npmjs.com/package/express-async-errors"
const mongoose = require("mongoose"); // https://www.npmjs.com/package/mongoose
const config = require("config"); // https://www.npmjs.com/package/config
const cors = require("cors"); // https://www.npmjs.com/package/cors
const winston = require("winston"); // https://www.npmjs.com/package/winston
require("winston-mongodb"); // https://www.npmjs.com/package/winston-mongodb

const { movies } = require("./routes/movies");
const { genres } = require("./routes/genres");
const { customers } = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const error = require("./middleware/error");

// catch errors
winston.add(new winston.transports.File({ filename: "logfile.log" })); // added a loger using the winston library
// https://github.com/winstonjs/winston/tree/2.x#using-the-default-logger
// https://stackoverflow.com/questions/51702149/invalid-transport-must-be-an-object-with-a-log-method-winston-mongodb-logging

// catch unhandled exceptions
// https://www.npmjs.com/package/winston#handling-uncaught-exceptions-with-winston
winston.add(
  new winston.transports.File({
    filename: "uncaughtExepctions.log",
    handleExceptions: true,
  })
);

// catch rejected promises.
// https://www.npmjs.com/package/winston#handling-uncaught-promise-rejections-with-winston
winston.add(
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

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not defined.");
  process.exit(1);
}

// Connect to mongoDB
mongoose
  .connect("mongodb://localhost/vidly", { useFindAndModify: false })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Error connecting to Mongodb..."));

const app = express();
app.use(cors());
app.use(express.json()); //allows json parsing
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

// Listen for connections
const port = process.env.PORT || 3900;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
