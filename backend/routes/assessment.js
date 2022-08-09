const express = require("express");
const router = express.Router();
const { create, getAssessment } = require("../controllers/assessment");
// const { yearById } = require("../controllers/year");
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/assessment", requireSignin, adminMiddleware, create);
//router.post("/syllabus-assessment/:slug", getAssessment);

// router.get("/sections", list);
// router.get("/:slug", read);

// router.param("yearId", yearById);

module.exports = router;