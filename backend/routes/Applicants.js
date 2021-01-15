const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("dotenv").config();

// Load input validation

// Load User model
const Applicant = require("../models/ApplicantSchema");
const User = require("../models/UserSchema");

// Load profile
router.post("/profile/load", (req, res) => {
  const { user_id } = req.body;

  Applicant.findOne({ user_id: user_id }).then((appl) => {
    if (!appl) {
      User.findOne({ _id: mongoose.Types.ObjectId(user_id) }).then((user) => {
        const applicant = new Applicant({
          user_id,
          name: user.name,
          email: user.email,
        });

        applicant
          .save()
          .then((newAppl) => res.json(newAppl))
          .catch((err) => console.log(err));
      });
    } else {
      res.json(appl);
    }
  });
});

// Add education
router.post("/profile/addeducation", (req, res) => {
  const { user_id, institute_name, start_year, end_year } = req.body;
  Applicant.findOneAndUpdate(
    { user_id: user_id },
    {
      $push: {
        education: {
          institute_name,
          start_year,
          end_year,
        },
      },
    },
    {
      new: true,
    },
    (err, doc) => {
      if (err) throw err;
      console.log(doc);
      res.json(doc);
    }
  );
});

// Remove education
router.post("/profile/removeeducation", (req, res) => {
  const { user_id, education_id } = req.body;
  console.log(education_id);
  Applicant.findOneAndUpdate(
    { user_id: user_id },
    { $pull: { education: { _id: mongoose.Types.ObjectId(education_id) } } },
    {
      new: true,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

// Add skill
router.post("/profile/addskill", (req, res) => {
  const { user_id, skill } = req.body;
  console.log(user_id);

  Applicant.findOneAndUpdate(
    { user_id: user_id },
    { $addToSet: { skills: skill } },
    {
      new: true,
    },
    (err, doc) => {
      if (err) throw err;
      console.log(doc);
      res.json(doc);
    }
  );
});

// Remove skill
router.post("/profile/removeskill", (req, res) => {
  const { user_id, skill } = req.body;
  Applicant.findOneAndUpdate(
    { user_id: user_id },
    { $pull: { skills: skill } },
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
