const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load input validation

// Load models
const Job = require("../../models/JobSchema");
const Recruiter = require("../../models/RecruiterSchema");

// Load jobs
router.post("/load", (req, res) => {
  const { user_id } = req.body;

  Job.find({ user_id: mongoose.Types.ObjectId(user_id) })
    .then((jobs) => res.json(jobs))
    .catch((err) => console.log(err));
});

// Remove job
router.post("/removejob", (req, res) => {
  const { user_id, job_id } = req.body;
  Job.findOneAndRemove({ _id: mongoose.Types.ObjectId(job_id) }, (err, doc) => {
    if (err) throw err;

    Job.find({ user_id: mongoose.Types.ObjectId(user_id) })
      .then((jobs) => res.json(jobs))
      .catch((err) => console.log(err));
  });
});

module.exports = router;
