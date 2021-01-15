const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  recruiter_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  max_applicants: {
    type: Number,
    required: true,
  },
  positions_available: {
    type: Number,
    required: true,
  },
  date_of_posting: {
    type: Date,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  skills: [
    {
      type: String,
    },
  ],
  job_type: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  job_applicants: [
    {
      applicant_id: {
        type: String,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      sop: {
        type: String,
        required: true,
      },
      date_of_application: {
        type: Date,
        required: true,
      },
    },
  ],
});

// Create collection "users"
module.exports = Job = mongoose.model("jobs", JobSchema);
