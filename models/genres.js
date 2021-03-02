const mongoose = require("mongoose");
const Joi = require("joi");

// mongoDB genre schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
});

// MongoDB genre Model
const Genre = mongoose.model("Genre", genreSchema);

// Joi Validation
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });

  return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
