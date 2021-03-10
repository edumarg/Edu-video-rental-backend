const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

// mongoDB users schema

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    require: true,
    min: 8,
    max: 1024,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

usersSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, name: this.name },
    config.get("jwtPrivateKey")
  );
  return token;
};

// mondoDB user model

const User = new mongoose.model("User", usersSchema);

// Joi validation

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*s).{8,16}$"))
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters, no more than 16 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit. ",
      })
      .required(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
