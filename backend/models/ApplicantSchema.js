const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const ApplicantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  education: [
    {
      institute_name: {
        type: String,
        required: true,
      },
      start_year: {
        type: Number,
        required: true,
      },
      end_year: {
        type: Number,
      },
      _id: false,
    },
  ],
  skills: [
    {
      type: String,
    },
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  jobs_applied: [
    {
      type: String,
    },
  ],
  status: {
    type: String,
  },
});

// Create collection "applicants"
module.exports = Applicant = mongoose.model("applicants", ApplicantSchema);
