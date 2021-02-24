const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json()); //allows json parsing

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

// Listen for connections
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
