const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const RecruiterSchema = new Schema({
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
  phone_number: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  company: {
    type: String,
    required: true,
  },
});

// Create collection "users"
module.exports = Recruiter = mongoose.model("recruiters", RecruiterSchema);
