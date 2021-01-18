const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const users = require("./models/UserSchema");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Bodyparsing middleware
app.use(express.urlencoded()); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

app.use(cors()); // allow cross origin resource sharing

// connect to mongodb
const DB_NAME = "job_portal_db";
mongoose
  .connect("mongodb://127.0.0.1:27017/" + DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// mongoose settings
mongoose.set("useFindAndModify", false);

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/Passport")(passport);

// routes
app.use("/users", require("./routes/Users"));

app.use("/applicant/profile", require("./routes/applicant/Profile"));
app.use("/applicant/dashboard", require("./routes/applicant/Dashboard"));
app.use("/applicant/applications", require("./routes/applicant/Applications"));

app.use("/recruiter/profile", require("./routes/recruiter/Profile"));
app.use("/recruiter/joblisting", require("./routes/recruiter/JobListing"));
app.use("/recruiter/dashboard", require("./routes/recruiter/Dashboard"));
app.use("/recruiter/acceptances", require("./routes/recruiter/Acceptances"));
app.use(
  "/recruiter/applications",
  require("./routes/recruiter/JobSpecificApplications")
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
