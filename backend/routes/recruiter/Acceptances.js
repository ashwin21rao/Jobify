const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load input validation

// Load models
const Job = require("../../models/JobSchema");
const Applicant = require("../../models/ApplicantSchema");
const Recruiter = require("../../models/RecruiterSchema");

// Load accepted employees
router.post("/load", (req, res) => {
  const { user_id } = req.body;

  // get accepted employees of recruiter and join with their personal details
  Job.aggregate([
    { $match: { user_id, "job_applicants.status": "Accepted" } },
    {
      $set: {
        job_applicants: {
          $filter: {
            input: "$job_applicants",
            as: "item",
            cond: { $eq: ["$$item.status", "Accepted"] },
          },
        },
      },
    },
    { $unwind: "$job_applicants" },
    {
      $set: {
        "job_applicants.obj_appl_id": {
          $toObjectId: "$job_applicants.applicant_id",
        },
      },
    },
    {
      $lookup: {
        from: Applicant.collection.collectionName,
        localField: "job_applicants.obj_appl_id",
        foreignField: "_id",
        as: "job_applicants.personal_data",
      },
    },
    {
      $set: {
        "job_applicants.personal_data": {
          $arrayElemAt: ["$job_applicants.personal_data", 0],
        },
      },
    },
    {
      $project: {
        title: 1,
        job_type: 1,
        applicant_details: "$job_applicants",
      },
    },
    {
      $unset: [
        "applicant_details.personal_data.email",
        "applicant_details.personal_data.user_id",
        "applicant_details.personal_data.jobs_applied",
        "applicant_details.personal_data._id",
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
        "job_applicants.$.applicant_rating": rating,
      },
    },
    (err, result) => {
      if (err) throw err;

      // find average of all ratings for that applicant
      Job.aggregate([
        {
          $match: {
            job_applicants: {
              $elemMatch: {
                applicant_id,
                status: "Accepted",
                applicant_rating: { $ne: 0 },
              },
            },
          },
        },
        {
          $set: {
            job_applicants: {
              $filter: {
                input: "$job_applicants",
                as: "item",
                cond: { $eq: ["$$item.applicant_id", applicant_id] },
              },
            },
          },
        },
        {
          $set: {
            job_applicants: {
              $arrayElemAt: ["$job_applicants", 0],
            },
          },
        },
        {
          $group: {
            _id: "",
            avg_rating: { $avg: "$job_applicants.applicant_rating" },
          },
        },
        {
          $project: {
            avg_rating: "$avg_rating",
            _id: false,
          },
        },
      ])
        .then((arr) => {
          // update applicant rating
          Applicant.updateOne(
            {
              _id: mongoose.Types.ObjectId(applicant_id),
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
