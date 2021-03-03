const express = require("express");
const mongoose = require("mongoose");

const movies = require("./routes/movies");
const { genres } = require("./routes/genres");
const customers = require("./routes/customers");

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

// Listen for connections
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
