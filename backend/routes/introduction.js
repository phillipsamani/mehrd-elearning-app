const express = require("express");
const router = express.Router();
const { create, list, read } = require("../controllers/introduction");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/introduction", 
    // requireSignin, 
    // adminMiddleware, 
    create);
router.get("/introductions", list);
router.get("/introduction/:introduction", read);
// router.delete("/introduction/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
