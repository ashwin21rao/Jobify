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

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/Passport")(passport);

// routes
app.use("/users", require("./routes/Users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
