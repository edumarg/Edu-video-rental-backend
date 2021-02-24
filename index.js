const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json()); //allows json parsing

// GENRES services

const genres = [];

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
  });

  return schema.validate(genre);
}

// GET Genres
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

// GET genre by id
app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

// POST new genre
app.post("/api/genres", (req, res) => {
  const result = validateGenre(req.body);

  if (result.error) return res.status(400).send(result.error.message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

// PUT or update an existing genre
app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  const result = validateGenre(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  genre.name = req.body.name;
  res.send(genre);
});

//DELETE genre
app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

// Movies services
const movies = [];
// movie schema: {
//     id,
//    title,
//    genreId ,
//    numberInStock,
//    dailyRentalRate,
// }

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().alphanum().min(3).max(30).required(),
    genreId: Joi.number().integer().min(1).required(),
    numberInStock: Joi.number().positive().integer().min(1).max(100).required(),
    dailyRentalRate: Joi.number().positive().min(0.5).max(10.0).required(),
  });

  return schema.validate(movie);
}

// GET movies
app.get("/api/movies", (req, res) => {
  res.send(movies);
});

// GET movie by id
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

// POST new movie
app.post("/api/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) return res.status(400).send(result.error.message);

  const movie = {
    id: movies.length + 1,
    title: req.body.title,
    genreId: req.body.genreId,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  };
  movies.push(movie);
  res.send(movie);
});

// PUT or update an existing genre
app.put("/api/movies/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  const result = validateMovie(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  movie.title = req.body.title;
  movie.genreId = req.body.genreId;
  movie.numberInStock = req.body.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate;
  res.send(movie);
});

//DELETE movie
app.delete("/api/movies/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  const index = movies.indexOf(movie);
  movies.splice(index, 1);
  res.send(movie);
});

// Listen for connections
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
