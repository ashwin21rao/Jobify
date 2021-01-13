const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const DB_NAME = "job_portal_db";
const withAuth = require("./middleware");

require("dotenv").config();
const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY;

// middleware
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(cors()); // enable cors (cross-origin resource sharing)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies

// connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/" + DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// routes
app.use("/", require("./routes/Users"));

app.get("http://localhost:3000/dashboard", withAuth, function (req, res) {
  res.send("Logged In!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
