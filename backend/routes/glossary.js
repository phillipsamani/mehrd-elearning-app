const express = require("express");
const router = express.Router();
const { create, getGlossary } = require("../controllers/glossary");
// const { yearById } = require("../controllers/year");
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/glossary", requireSignin, adminMiddleware, create);
router.post("/syllabus-glossary/:slug", getGlossary);

// router.get("/sections", list);
// router.get("/:slug", read);

// router.param("yearId", yearById);

module.exports = router;