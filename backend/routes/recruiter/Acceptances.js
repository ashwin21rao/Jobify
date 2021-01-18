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
        _id: 0,
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

module.exports = router;
