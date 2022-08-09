const User = require("../models/user");
const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");

//from config folder
const config = require("config");
const clientUrl = config.get("CLIENT_URL");
const jwtSecret = config.get("JWT_SECRET");

exports.signup = (req, res) => {
  // console.log(req.body);
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email has been taken",
      });
    }

    const { name, email, password,  admin, teacher, student } = req.body;
    let username = shortId.generate();
    let profile = `${clientUrl}/profile/${username}`;

    let newUser = new User({ name, email, password, admin, teacher, student, profile, username });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Signup success! Please signin.",
      });
    });
  });
};

exports.signin = (req, res) => {
  // check if user exists
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    // generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "5d" });
    // persist the token as 't' in cookie with expiry date
    res.cookie("token", token, { expiresIn: "5d" });
    // return response with user and token to frontend client
    const { id, username, name, email, admin, teacher, student, profile } = user;
    return res.json({
      token,
      user: { id, username, name, email, admin, teacher, student, profile },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

exports.requireSignin = expressJwt({
  secret: jwtSecret,
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  });
};
