const jwt = require("jsonwebtoken");

require("dotenv").config();
const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY;

// look for secret token in browser cookies to protect a route
const withAuth = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, SECRET_TOKEN_KEY, function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};
module.exports = withAuth;
