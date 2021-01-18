const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("dotenv").config();

// Load input validation

// Load User model
const Recruiter = require("../../models/RecruiterSchema");
const User = require("../../models/UserSchema");

// Load profile
router.post("/load", (req, res) => {
  const { user_id } = req.body;

  Recruiter.findOne({ user_id: user_id })
    .then((recr) => res.json(recr))
    .catch((err) => console.log(err));
});

// Update profile
router.post("/update", (req, res) => {
  const { user_id, phone_number, company, bio } = req.body;
  Recruiter.findOneAndUpdate(
    { user_id },
    {
      phone_number,
      company,
      bio,
    },
    {
      new: true,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

module.exports = router;
