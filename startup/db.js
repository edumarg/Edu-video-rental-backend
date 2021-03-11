const mongoose = require("mongoose"); // https://www.npmjs.com/package/mongoose
const winston = require("winston"); // https://www.npmjs.com/package/winston

function db() {
  // Connect to mongoDB
  mongoose
    .connect("mongodb://localhost/vidly", { useFindAndModify: false })
    .then(() => winston.info("Connected to MongoDB..."));
}

module.exports = db;
