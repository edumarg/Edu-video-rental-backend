const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

const { movies } = require("./routes/movies");
const { genres } = require("./routes/genres");
const { customers } = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const error = require("./middleware/error");

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
