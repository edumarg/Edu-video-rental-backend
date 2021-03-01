const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");

// Movies services

// mongoDB movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 30 },
  genreId: { type: String, required: true, minlength: 1 },
  numberInStock: { type: Number, required: true, min: 1, max: 100 },
  dailyRentalRate: { type: Number, required: true, min: 0.5, max: 10 },
});

// MongoDB movie Model
const Movie = mongoose.model("Movie", movieSchema);

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
    title: Joi.string().min(3).max(30).required(),
    genreId: Joi.string().alphanumeric().min(1).required(),
    numberInStock: Joi.number().positive().integer().min(1).max(100).required(),
    dailyRentalRate: Joi.number().positive().min(0.5).max(10.0).required(),
  });

  return schema.validate(movie);
}

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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const movie = movies.find((movie) => movie.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send("Movie not found");

  const index = movies.indexOf(movie);
  movies.splice(index, 1);
  res.send(movie);
});

module.exports = router;
