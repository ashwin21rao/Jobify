const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const UserSchema = mongoose.model("users");

require("dotenv").config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_TOKEN_KEY,
};

// JWT authentication
module.exports = (passport) => {
  passport.use(
    "jwt",
    new JwtStrategy(opts, (jwt_payload, done) => {
      UserSchema.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            done(null, user); // return corresponding user
          }
          done(null, false); // no such user
        })
        .catch((err) => console.log(err));
    })
  );
};
