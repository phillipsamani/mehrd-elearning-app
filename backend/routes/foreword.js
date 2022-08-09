const express = require("express");
const router = express.Router();
const { create, getForeword } = require("../controllers/foreword");
// const { yearById } = require("../controllers/year");
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/foreword", requireSignin, adminMiddleware, create);
router.post("/syllabus-foreword/:slug", getForeword);

// router.get("/sections", list);
// router.get("/:slug", read);

// router.param("yearId", yearById);

module.exports = router;