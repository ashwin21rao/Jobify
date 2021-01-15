const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load input validation

// Load models
const Job = require("../../models/JobSchema");
const Recruiter = require("../../models/RecruiterSchema");

// Add listing
router.post("/addlisting", (req, res) => {
  const {
    user_id,
    title,
    job_type,
    date_of_posting,
    deadline,
    max_applicants,
    positions_available,
    duration,
    salary,
    rating,
    skills,
  } = req.body;

  Recruiter.findOne({ user_id: mongoose.Types.ObjectId(user_id) })
    .then((recr) => {
      const newJob = new Job({
        user_id,
        recruiter_id: recr._id,
        title,
        job_type,
        date_of_posting,
        deadline,
        max_applicants,
        positions_available,
        duration,
        salary,
        rating,
        skills,
      });

      newJob
        .save()
        .then((newJob) => res.json(newJob))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// Edit listing
router.post("/editlisting", (req, res) => {
  const {
    job_id,
    deadline,
    max_applicants,
    positions_available,
    skills,
  } = req.body;
  Job.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(job_id) },
    {
      deadline,
      max_applicants,
      positions_available,
      skills,
    },
    (err, doc) => {
      if (err) throw err;
      res.json(doc);
    }
  );
});

module.exports = router;
