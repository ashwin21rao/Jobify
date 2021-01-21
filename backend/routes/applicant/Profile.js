const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load input validation

// Load User model
const Applicant = require("../../models/ApplicantSchema");
const User = require("../../models/UserSchema");

// Load profile
router.post("/load", (req, res) => {
  const { user_id } = req.body;

  Applicant.findOne({ user_id: user_id })
    .then((appl) => res.json(appl))
    .catch((err) => console.log(err));
});

// update details
router.post("/updatedetails", (req, res) => {
  const { user_id, name } = req.body;
  User.updateOne(
    { _id: mongoose.Types.ObjectId(user_id) },
    {
      $set: {
        name,
      },
    },
    (err, result) => {
      if (err) throw err;

      Applicant.findOneAndUpdate(
        { user_id },
        {
          $set: {
            name,
          },
        },
        {
          new: true,
        },
        (err, doc) => {
          if (err) throw err;
          res.json(doc);
        }
      );
    }
  );
});

// Add education
router.post("/addeducation", (req, res) => {
  const { user_id, institute_name, start_year, end_year } = req.body;
  Applicant.findOneAndUpdate(
    { user_id },
    {
      $addToSet: {
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
      res.json(doc);
    }
  );
});

// Remove education
router.post("/removeeducation", (req, res) => {
  const { user_id, institute_name, start_year, end_year } = req.body;
  Applicant.findOneAndUpdate(
    { user_id },
    { $pull: { education: { institute_name, start_year, end_year } } },
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
router.post("/addskill", (req, res) => {
  const { user_id, skill } = req.body;
  Applicant.findOneAndUpdate(
    { user_id },
    { $addToSet: { skills: skill } },
    {
      new: true,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

// Remove skill
router.post("/removeskill", (req, res) => {
  const { user_id, skill } = req.body;
  Applicant.findOneAndUpdate(
    { user_id },
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
