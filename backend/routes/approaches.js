const express = require("express");
const router = express.Router();
const { create } = require("../controllers/approaches");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/approach", requireSignin, adminMiddleware, create);

module.exports = router;