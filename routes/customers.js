const express = require("express");
const router = express.Router();

const { Customer, validate } = require("../models/customers");

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
  const validation = validate(req.body);
  if (validation.error) res.status(400).send(validation.error.message);

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

  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);

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
