const express = require("express");
const router = express.Router();

const { User, validate } = require("../models/users");

// GET Users

async function getUsers() {
  const users = await User.find();
  return users;
}

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.send(users);
});

// Get User by ID

async function getUserById(id) {
  const user = await User.findById(id);
  return user;
}

router.get("/:id", async (req, res) => {
  const id = req.params.id;
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

router.post("/", async (req, res) => {
  const data = req.body;
  const validation = validate(data);
  if (validation.error) return res.status(400).send(validation.error.message);
  const user = await postNewUser(data);
  res.send(user);
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

router.put("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await deleteUserById(id);
  if (!user) return res.status(404).send("User not found");
  res.send(user);
});

module.exports = router;
