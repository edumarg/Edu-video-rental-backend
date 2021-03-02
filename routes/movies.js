const express = require("express");
const router = express.Router();

const { Movie, validate } = require("../models/movies");

// GET movies

async function getMovies() {
  const movies = await Movie.find();
  return movies;
}

router.get("/", async (req, res) => {
  const movies = await getMovies();
  res.send(movies);
});

// GET movie by id

async function getMovieById(id) {
  const movie = await Movie.findById(id);
  return movie;
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = await getMovieById(id);
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

// POST new movie

async function postNewMovie(data) {
  try {
    const movie = new Movie(data);
    const result = await movie.save();
    return result;
  } catch (ex) {
    return ex.message;
  }
}

router.post("/", async (req, res) => {
  const validation = validate();
  if (validation.error) return res.status(400).send(validation.error.message);

  const movie = await postNewMovie(req.body);
  res.send(movie);
});

// PUT or update an existing genre

async function updateMovieById(id, data) {
  const movie = await Movie.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );
  return movie;
}

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);

  const movie = await updateMovieById(id, data);
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

//DELETE movie

async function deleteMovieById(id) {
  const movie = await Movie.findByIdAndRemove(id);
  return movie;
}

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const movie = await deleteMovieById(id);
  if (!movie) return res.status(404).send("Movie not found");
  res.send(movie);
});

module.exports = router;
