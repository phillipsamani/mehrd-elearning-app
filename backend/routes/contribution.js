const express = require("express");
const router = express.Router();
const { create, getContribution } = require("../controllers/contribution");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/contribution", requireSignin, adminMiddleware, create);
router.post("/syllabus-contribution/:slug", getContribution);

module.exports = router;