const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load input validation

// Load models
const Job = require("../../models/JobSchema");
const Applicant = require("../../models/ApplicantSchema");

// Load job applications
router.post("/load", (req, res) => {
  const { job_id } = req.body;

  // join each job applicant with applicant data (return array of applicant data)
  Job.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(job_id) } },
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
        job_applicants: 1,
        _id: 0,
      },
    },
    {
      $unset: [
        "job_applicants.personal_data.email",
        "job_applicants.personal_data.user_id",
        "job_applicants.personal_data.jobs_applied",
        "job_applicants.personal_data._id",
      ],
    },
  ])
    .then((jobs) => {
      jobs = jobs
        .map((obj) => obj.job_applicants)
        .filter((appl) => appl.status !== "Rejected");

      return res.json(jobs);
    })
    .catch((err) => console.log(err));
});

// change status of applicant
router.post("/changestatus", (req, res) => {
  const { job_id, applicant_id, status } = req.body;

  Job.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(job_id),
      "job_applicants.applicant_id": applicant_id,
    },
    {
      $set: {
        "job_applicants.$.status": status,
      },
    },
    {
      new: true,
    },
    (err, appl) => {
      if (err) throw err;
      res.json(appl);
    }
  );
});

// accept applicant
router.post("/accept", (req, res) => {
  const { job_id, applicant_id } = req.body;

  /// set all other job applications to rejected (which are not accepted)
  Job.updateMany(
    {
      _id: { $ne: mongoose.Types.ObjectId(job_id) },
      job_applicants: {
        $elemMatch: {
          applicant_id,
          status: { $ne: "Accepted" },
        },
      },
    },
    {
      $set: {
        "job_applicants.$.status": "Rejected",
      },
    },
    (err, result) => {
      if (err) throw err;

      // change status to accepted
      // decrement available positions, add date of joining
      Job.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(job_id),
          "job_applicants.applicant_id": applicant_id,
        },
        {
          $set: {
            "job_applicants.$.status": "Accepted",
            "job_applicants.$.date_of_joining": new Date(),
          },
          $inc: {
            positions_available: -1,
          },
        },
        {
          upsert: true,
          new: true,
        },
        (err, appl) => {
          if (err) throw err;
          res.json(appl);
        }
      );
    }
  );
});

module.exports = router;
