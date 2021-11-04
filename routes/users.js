const { User, validate } = require("../models/user");
const validateObjectId = require("../middlewares/validateObjectId");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send("An unexpected error occured.");
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(400).send("The User with the given ID was not found.");

    res.send(_.pick(user, ["_id", "name", "username"]));
  } catch (err) {
    res.status(500).send("An unexpected error occured.");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ username: req.body.username });
    if (user)
      return res
        .status(400)
        .send("User with this username is already registered.");

    user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(_.pick(user, ["_id", "name", "username"]));
  } catch (err) {
    console.log(err);
    res.status(500).send("An unexpected error occured.");
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(400).send("The User with the given ID was not found.");

    const { error } = validateUserProperties(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    user.name = req.body.name;
    user.username = req.body.username;

    await user.save();
    res.send(_.pick(user, ["_id", "name", "username"]));
  } catch (err) {
    res.status(500).send("An unexpected error occured.");
  }
});

router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user)
      return res.status(400).send("The User with the given ID was not found.");

    res.send(_.pick(user, ["_id", "name", "username"]));
  } catch (err) {
    res.status(500).send("An unexpected error occured.");
  }
});

function validateUserProperties(user) {
  const schema = {
    name: Joi.string().min(3).max(55).required(),
    username: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(user, schema);
}

module.exports = router;
