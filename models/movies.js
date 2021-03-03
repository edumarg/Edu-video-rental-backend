const mongoose = require("mongoose");
const Joi = require("joi");

const { genreSchema } = require("./genres");

// mongoDB movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 30 },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 100 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 10 },
});

// MongoDB movie Model
const Movie = mongoose.model("Movie", movieSchema);

// Joi Validation

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(30).required().trim(),
    genreId: Joi.string().alphanum().min(1).required(),
    numberInStock: Joi.number().positive().integer().min(1).max(100).required(),
    dailyRentalRate: Joi.number().positive().min(0.5).max(10.0).required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
