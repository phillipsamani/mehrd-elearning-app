const express = require("express");
const router = express.Router();
const { create, getResource } = require("../controllers/resource");
// const { yearById } = require("../controllers/year");
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/resource", requireSignin, adminMiddleware, create);
router.post("/syllabus-resource/:slug", getResource);

// router.get("/sections", list);
// router.get("/:slug", read);

// router.param("yearId", yearById);

module.exports = router;