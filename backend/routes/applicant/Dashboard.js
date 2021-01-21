const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load input validation

// Load models
const Job = require("../../models/JobSchema");
const Applicant = require("../../models/ApplicantSchema");
const Recruiter = require("../../models/RecruiterSchema");

// Load jobs
router.post("/load", (req, res) => {
  const { user_id } = req.body;

  // join job with recruiter to get recruiter details (name, company, etc)
  Job.aggregate([
    {
      $addFields: {
        obj_recr_id: { $toObjectId: "$recruiter_id" },
      },
    },
    {
      $lookup: {
        from: Recruiter.collection.collectionName,
        localField: "obj_recr_id",
        foreignField: "_id",
        as: "recruiter_details",
      },
    },
    {
      $set: {
        recruiter_details: {
          $arrayElemAt: ["$recruiter_details", 0],
        },
      },
    },
    {
      $unset: [
        "recruiter_details.email",
        "recruiter_details.phone_number",
        "recruiter_details.bio",
      ],
    },
  ])
    .then((jobs) => {
      Applicant.findOne({ user_id: mongoose.Types.ObjectId(user_id) })
        .then((appl) => {
          return res.json({ jobData: jobs, jobsApplied: appl.jobs_applied });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// Apply to job
router.post("/apply", (req, res) => {
  const { user_id, job_id, sop, date_of_application } = req.body;

  Applicant.findOneAndUpdate(
    { user_id: mongoose.Types.ObjectId(user_id) },
    {
      $push: {
        jobs_applied: job_id,
      },
    },
    { new: true },
    (err, appl) => {
      if (err) throw err;

      Job.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(job_id) },
        {
          $push: {
            job_applicants: {
              user_id,
              applicant_id: appl._id,
              status: "Applied",
              sop,
              date_of_application,
            },
          },
        },
        { new: true },
        (err, doc) => {
          if (err) throw err;
          return res.json({ jobsApplied: appl.jobs_applied });
        }
      );
    }
  );
});

// check for too many outstanding applications
router.post("/outstandingapplications", (req, res) => {
  const { user_id } = req.body;

  Job.find({
    job_applicants: {
      $elemMatch: {
        user_id,
        status: {
          $in: ["Applied", "Shortlisted"],
        },
      },
    },
  })
    .then((jobs) => {
      res.json({ outstanding_applications: jobs.length });
    })
    .catch((err) => console.log(err));
});

router.post("/checkifaccepted", (req, res) => {
  const { user_id } = req.body;

  Job.find({
    job_applicants: {
      $elemMatch: {
        user_id,
        status: "Accepted",
      },
    },
  })
    .then((jobs) => {
      res.json({ accepted: jobs.length > 0 });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
