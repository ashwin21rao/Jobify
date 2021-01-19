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

  // join applied job with recruiter to get recruiter details (name, etc)
  Job.aggregate([
    { $match: { "job_applicants.user_id": user_id } },
    {
      $set: {
        applicant_details: {
          $filter: {
            input: "$job_applicants",
            as: "item",
            cond: { $eq: ["$$item.user_id", user_id] },
          },
        },
        obj_recr_id: { $toObjectId: "$recruiter_id" },
      },
    },
    {
      $set: {
        applicant_details: {
          $arrayElemAt: ["$applicant_details", 0],
        },
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
        "job_applicants",
      ],
    },
  ])
    .then((jobs) => {
      return res.json(jobs);
    })
    .catch((err) => console.log(err));
});

router.post("/rate", (req, res) => {
  const { job_id, applicant_id, rating } = req.body;

  Job.updateOne(
    {
      _id: mongoose.Types.ObjectId(job_id),
      "job_applicants.applicant_id": applicant_id,
    },
    {
      $set: {
        "job_applicants.$.job_rating": rating,
      },
    },
    (err, result) => {
      if (err) throw err;

      // find average of all ratings for that job
      Job.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(job_id) } },
        {
          $set: {
            job_applicants: {
              $filter: {
                input: "$job_applicants",
                as: "item",
                cond: { $ne: ["$$item.job_rating", 0] },
              },
            },
          },
        },
        {
          $project: {
            avg_rating: { $avg: "$job_applicants.job_rating" },
            _id: false,
          },
        },
      ])
        .then((arr) => {
          // update job rating
          Job.updateOne(
            {
              _id: mongoose.Types.ObjectId(job_id),
            },
            {
              $set: {
                rating: arr[0].avg_rating,
              },
            },
            (err, result) => {
              if (err) throw err;
              res.json({ rating: arr[0].avg_rating });
            }
          );
        })
        .catch((err) => console.log(err));
    }
  );
});

module.exports = router;
