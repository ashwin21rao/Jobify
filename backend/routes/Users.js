const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Load input validation
const validateSignup = require("../validation/Signup");
const validateLogin = require("../validation/Login");

// Load User model
const User = require("../models/UserSchema");
const Applicant = require("../models/ApplicantSchema");
const Recruiter = require("../models/RecruiterSchema");

// Signup route
router.post("/signup", (req, res) => {
  const { errors, isValid } = validateSignup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // check if user exists
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          // save new user
          newUser
            .save()
            .then((user) => {
              // save user in applicant or recruiter collection
              if (user.userType === "applicant") {
                const applicant = new Applicant({
                  user_id: user._id,
                  name: user.name,
                  email: user.email,
                });

                applicant
                  .save()
                  .then((appl) => res.json(user))
                  .catch((err) => console.log(err));
              } else if (user.userType === "recruiter") {
                const recruiter = new Recruiter({
                  user_id: user._id,
                  name: user.name,
                  email: user.email,
                });

                recruiter
                  .save()
                  .then((recr) => res.json(user))
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// login route (return JWT token)
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          userType: user.userType,
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET_TOKEN_KEY,
          {
            expiresIn: 86400, // 1 day in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Incorrect password" });
      }
    });
  });
});

module.exports = router;
