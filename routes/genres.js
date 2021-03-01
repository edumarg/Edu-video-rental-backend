const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");

// GENRES services

// mongoDB genre schema
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
});

// MongoDB genre Model
const Genre = mongoose.model("Genre", genreSchema);

// GET Genres
async function getGenres() {
  const genres = await Genre.find();
  return genres;
}

router.get("/", async (req, res) => {
  const genres = await getGenres();
  res.send(genres);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  return schema.validate(genre);
}

// GET genre by id

async function getGenreById(id) {
  const genre = await Genre.find({ _id: id });
  return genre;
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const genre = await getGenreById(id);
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

// POST new genre

async function postGenre(name) {
  try {
    const genre = new Genre({
      name: name,
    });
    const result = await genre.save();
    return result;
  } catch (ex) {
    return ex.message;
  }
}

router.post("/", async (req, res) => {
  const validation = validateGenre(req.body);
  if (validation.error) return res.status(400).send(validation.error.message);
  const name = req.body.name;
  const result = await postGenre(name);
  res.send(result);
});

// PUT or update an existing genre

async function updateGenre(id, data) {
  const result = await Genre.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );
  return result;
}

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(id);
  if (!genre) return res.status(404).send("Genre not found");

  const validate = validateGenre(req.body);
  if (validate.error) return res.status(400).send(validate.error.message);
  const data = req.body;
  const result = await updateGenre(id, data);
  res.send(result);
});

//DELETE genre

async function removeGenre(id) {
  const genre = await Genre.findByIdAndRemove(id);
  return genre;
}

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const genre = await Genre.findById(id);
  if (!genre) return res.status(404).send("Genre not found");
  const result = await removeGenre(id);
  res.send(result);
});

module.exports = router;
