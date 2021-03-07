const express = require("express");
const mongoose = require("mongoose");

const { movies } = require("./routes/movies");
const { genres } = require("./routes/genres");
const { customers } = require("./routes/customers");
const rentals = require("./routes/rentals");
const users = require("./routes/users");

// Connect to mongoDB
mongoose
  .connect("mongodb://localhost/vidly", { useFindAndModify: false })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Error connecting to Mongodb..."));

const app = express();
app.use(express.json()); //allows json parsing
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

// Listen for connections
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
