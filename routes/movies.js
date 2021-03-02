const express = require("express");
const router = express.Router();

const { Movie, validate } = require("../models/movies");

// GET movies
router.get("/", (req, res) => {
  res.send(movies);
});

// GET movie by id
router.get("/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

// POST new movie
router.post("/", (req, res) => {
  const validation = validate(req.body);

  if (validation.error) return res.status(400).send(validation.error.message);

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
router.put("/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  const validation = validate(req.body);
  if (validation.error) return res.status(400).send(validation.error.message);

  movie.title = req.body.title;
  movie.genreId = req.body.genreId;
  movie.numberInStock = req.body.numberInStock;
  movie.dailyRentalRate = req.body.dailyRentalRate;
  res.send(movie);
});

//DELETE movie
router.delete("/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  const index = movies.indexOf(movie);
  movies.splice(index, 1);
  res.send(movie);
});

module.exports = router;
