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

  Recruiter.findOne({ user_id: user_id }).then((recr) => {
    if (!recr) {
      User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).then((user) => {
        const recruiter = new Recruiter({
          user_id,
          name: user.name,
          email: user.email,
        });

        recruiter
          .save()
          .then((newRecr) => res.json(newRecr))
          .catch((err) => console.log(err));
      });
    } else {
      res.json(recr);
    }
  });
});

// Update profile
router.post("/update", (req, res) => {
  const { user_id, phone_number, bio } = req.body;
  Recruiter.findOneAndUpdate(
    { user_id },
    {
      phone_number,
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
