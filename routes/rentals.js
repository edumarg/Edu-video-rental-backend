const express = require("express");
const router = express.Router();

const { Rental, validate, validateId } = require("../models/rentals");
const { getMovieById } = require("./movies");
const { getCustomersById } = require("./customers");
const auth = require("../middleware/auth");

// GET rentals

async function getRentals() {
  const rentals = await Rental.find().sort({ dateOut: -1 });
  return rentals;
}

router.get("/", async (req, res) => {
  const rentals = await getRentals();
  res.send(rentals);
});

// GET rentals by ID

async function getRentalById(id) {
  const rental = await Rental.findById(id);
  return rental;
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const rental = await getRentalById(id);
  if (!rental) return res.status(404).send("Rental not found");
  res.send(rental);
});

// POST new rental

async function postNewRental(data) {
  try {
    const rental = new Rental(data);
    const result = await rental.save();
    return result;
  } catch (ex) {
    return ex.message;
  }
}

router.post("/", auth, async (req, res) => {
  const data = req.body;
  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);

  const customerId = req.body.customerId;
  if (!validateId(customerId)) return res.status(400).send("Invalid customer");
  const movieId = req.body.movieId;
  if (!validateId(movieId)) return res.status(400).send("Invalid movie");

  const customer = await getCustomersById(customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await getMovieById(movieId);
  if (!movie) return res.status(400).send("Invalid movie");
  if (movie.numberInStock === 0) res.status(400).send("Movie not in stock");

  const rental = {
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  };

  const result = await postNewRental(rental);

  movie.numberInStock--;
  movie.save();

  res.send(result);
});

module.exports = router;
