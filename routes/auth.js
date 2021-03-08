const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

const { User } = require("../models/users");

function validateUser(user) {
  const schema = Joi.object({
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

// POST  auth user

async function unHashPassword(reqPassword, userPassword) {
  return await bcrypt.compare(reqPassword, userPassword);
}

router.post("/", async (req, res) => {
  const data = req.body;
  const validation = validateUser(data);
  if (validation.error) return res.status(400).send(validation.error.message);

  const user = await User.findOne({ email: data.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await unHashPassword(data.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
