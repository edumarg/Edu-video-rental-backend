const mongoose = require("mongoose");
const Joi = require("joi");

// mongodb Rental schema

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  phone: { type: String, required: true },
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3, maxlength: 30 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 10 },
});

const rentalSchema = new mongoose.Schema({
  customer: { type: customerSchema, required: true },
  movie: { type: movieSchema, required: true },
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturn: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

// mongodb Retanl model

const Rental = new mongoose.model("Rental", rentalSchema);

// Joi schema

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.movieSchema = movieSchema;
exports.customerSchema = customerSchema;
exports.validate = validateRental;
