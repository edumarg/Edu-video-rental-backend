const express = require("express"); // https://www.npmjs.com/package/express
const cors = require("cors"); // https://www.npmjs.com/package/cors

const { movies } = require("../routes/movies");
const { genres } = require("../routes/genres");
const { customers } = require("../routes/customers");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");

const error = require("../middleware/error");

function routes(app) {
  app.use(cors());
  app.use(express.json()); //allows json parsing
  app.use("/api/movies", movies);
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
}

module.exports = routes;
