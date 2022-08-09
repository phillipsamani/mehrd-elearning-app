const express = require("express");
const router = express.Router();
const { create, list, read, remove } = require("../controllers/aim");
// , list, read, remove
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/aim", 
    // requireSignin, 
    // adminMiddleware, 
    create);
router.get("/aims", list);
router.get("/aim/:aim", read);
router.delete("/aim/:aim", requireSignin, adminMiddleware, remove);

module.exports = router;
