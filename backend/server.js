const express = require("express");
const app = express();
const mongoose = require("mongoose");
const DB_NAME = "job-application-auth";

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies

// connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/" + DB_NAME, {
  useNewUrlParser: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully !");
});

// routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
