const express = require("express");
const router = express.Router();

const { Genre, validate } = require("../models/genres");

// GET Genres

async function getGenres() {
  const genres = await Genre.find();
  return genres;
}

router.get("/", async (req, res) => {
  const genres = await getGenres();
  res.send(genres);
});

// GET genre by id

async function getGenreById(id) {
  const genre = await Genre.findById(id);
  return genre;
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const genre = await getGenreById(id);
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

// POST new genre

async function postNewGenre(name) {
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
  const validation = validate(req.body);
  if (validation.error) return res.status(400).send(validation.error.message);

  const name = req.body.name;
  const genre = await postNewGenre(name);
  res.send(genre);
});

// PUT or update an existing genre

async function updateGenreById(id, data) {
  const genre = await Genre.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );
  return genre;
}

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);

  const genre = await updateGenreById(id, data);
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

//DELETE genre

async function removeGenre(id) {
  const genre = await Genre.findByIdAndRemove(id);
  return genre;
}

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const genre = await removeGenre(id);
  if (!genre) return res.status(404).send("Genre not found");
  res.send(genre);
});

exports.genres = router;
exports.getGenreById = getGenreById;
