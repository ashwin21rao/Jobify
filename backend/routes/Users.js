const express = require("express");
const router = express.Router();
const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");

// Login page
router.post("/login", function (req, res) {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error",
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect email or password",
      });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500).json({
            error: "Internal error",
          });
        } else if (!same) {
          res.status(401).json({
            error: "Incorrect email or password",
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: "1h",
          });
          res.cookie("token", token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

// Register page
router.post("/signup", function (req, res) {
  const { name, email, password, userType } = req.body;
  const user = new User({ name, email, password, userType });
  user.save(function (err) {
    if (err) {
      res.status(500).send("Error registering new user.");
    } else {
      res.status(200).send("Welcome to the club!");
    }
  });
});

module.exports = router;
