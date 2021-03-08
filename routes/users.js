const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const { User, validate } = require("../models/users");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// GET Users

async function getUsers() {
  const users = await User.find().select({ name: 1, email: 1, _id: 0 });
  return users;
}

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

// Get User by ID

async function getUserById(id) {
  const user = await User.findById(id).select({ name: 1, email: 1, _id: 0 });
  return user;
}

router.get("/me", auth, async (req, res) => {
  const id = req.user._id;
  const user = await getUserById(id);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

// POST new user

async function postNewUser(data) {
  try {
    const user = new User(data);
    const result = await user.save();
    return result;
  } catch (ex) {
    return ex.message;
  }
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

router.post("/", auth, async (req, res) => {
  const data = req.body;
  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);

  const findUser = await User.findOne({ email: data.email });
  if (findUser) return res.status(400).send("User already Register");

  const hashedPassword = await hashPassword(data.password);
  data.password = hashedPassword;
  const user = await postNewUser(data);

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(user);
});

// PUT or update user by id

async function upateUserById(id, data) {
  const user = await User.findByIdAndUpdate(
    { _id: id },
    { $set: data },
    { new: true }
  );
  return user;
}

router.put("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);

  const user = await upateUserById(id, data);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

// DELETE user

async function deleteUserById(id) {
  const user = await User.findByIdAndRemove(id);
  return user;
}

router.delete("/:id", [auth, admin], async (req, res) => {
  const id = req.params.id;
  const user = await deleteUserById(id);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

module.exports = router;
