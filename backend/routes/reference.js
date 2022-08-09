const express = require("express");
const router = express.Router();
const { create } = require("../controllers/reference");
// const { yearById } = require("../controllers/year");
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/reference", requireSignin, adminMiddleware, create);
// router.post("/syllabus-reference/:slug", getReference);

// router.get("/sections", list);
// router.get("/:slug", read);

// router.param("yearId", yearById);

module.exports = router;