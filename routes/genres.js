const express = require("express");
const Joi = require("joi");
const router = express.Router();

// GENRES services

const genres = [];

// GET Genres
router.get("/", (req, res) => {
  res.send(genres);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
  });

  return schema.validate(genre);
}

// GET genre by id
router.get("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

// POST new genre
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  const result = validateGenre(req.body);
  if (result.error) return res.status(400).send(result.error.message);

  genre.name = req.body.name;
  res.send(genre);
});

//DELETE genre
router.delete("/:id", (req, res) => {
  const genre = genres.find((genre) => genre.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

module.exports = router;
