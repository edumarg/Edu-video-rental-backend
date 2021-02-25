const express = require("express");

const movies = require("./routes/movies");
const genres = require("./routes/genres");

const app = express();
app.use(express.json()); //allows json parsing
app.use("/api/movies", movies);
app.use("/api/genres", genres);

// Listen for connections
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
