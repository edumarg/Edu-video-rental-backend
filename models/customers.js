const mongoose = require("mongoose");
const Joi = require("joi");

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

// Joi Validation
function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
