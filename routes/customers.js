const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");

// mongoDB customer schema
const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  phone: { type: String, required: true },
});

// MongoDB customer Model
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomers(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

// GET Customers

async function getCustomers() {
  const customers = await Customer.find();
  return customers;
}

router.get("/", async (req, res) => {
  const customers = await getCustomers();
  res.send(customers);
});

// GET Customer by id
async function getCustomersById(id) {
  const customers = await Customer.findById(id);
  return customers;
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const customer = await getCustomersById(id);
  if (!customer) return res.status(404).send("Customer not found");
  res.send(customer);
});

// POST New Customer

async function postNewCustomer(data) {
  try {
    const customer = new Customer(data);
    const result = await customer.save();
    return result;
  } catch (ex) {
    return ex.message;
  }
}

router.post("/", async (req, res) => {
  const validate = validateCustomers(req.body);
  if (validate.error) res.status(400).send(validate.error.message);

  const customer = await postNewCustomer(req.body);
  res.send(customer);
});

// PUT or update Custumer

async function updateCustomerById(id, data) {
  const customer = await Customer.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );
  return customer;
}

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const validate = validateCustomers(data);
  if (validate.error) return res.status(400).send(validate.error.message);

  const customer = await updateCustomerById(id, data);
  if (!customer) return res.status(404).send("Customer not found");
  res.send(customer);
});

// DELETE Customer

async function deleteCustomerById(id) {
  const customer = await Customer.findByIdAndRemove(id);
  return customer;
}

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const customer = await deleteCustomerById(id);
  if (!customer) return res.status(404).send("Customer not Found");
  res.send(customer);
});

module.exports = router;
