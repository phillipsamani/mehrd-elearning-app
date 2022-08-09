const express = require("express");
//const { userById } = require("../controllers/user");

//validation
const { runValidation } = require("../validator");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validator/auth");

const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");

// import password reset validator

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", requireSignin, signout);
// userSigninValidator, runValidation,
 
// any route containing :userId, our app will first execute userByID()
//router.param("userId", userById);

module.exports = router;
