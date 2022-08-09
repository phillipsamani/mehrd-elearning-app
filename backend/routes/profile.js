const express = require("express");
const router = express.Router();
const { create, getProfile } = require("../controllers/profile");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/profile", requireSignin, adminMiddleware, create);
router.post("/syllabus-profile/:slug", getProfile);

module.exports = router;