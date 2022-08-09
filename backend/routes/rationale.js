const express = require("express");
const router = express.Router();
const { create, list, read } = require("../controllers/rationale");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/rationale", 
    // requireSignin, 
    // adminMiddleware, 
    create);
router.get("/rationales", list);
router.get("/rationale/:rationale", read);
// router.delete("/introduction/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
