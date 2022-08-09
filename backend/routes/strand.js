const express = require("express");
const router = express.Router();
const {
  create,
  update,
  list,
  read,
  remove,
  listBySearch,
  listRelatedStrands,
  strandWithAllSubstrands,
  
} = require("../controllers/strand");

// validators
const { runValidation } = require("../validator");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/strand", 
  // requireSignin, 
  // adminMiddleware, 
  create);
router.get("/strands", list);
router.post("/strands/related", listRelatedStrands);

router.post("/strand-substrands/:slug", strandWithAllSubstrands);
router.post("/strands/by/search", listBySearch);
router.get("/strand/:slug", read);
router.put(
  "/strand/:slug/",
  runValidation,
  requireSignin,
  adminMiddleware,
  update
);
router.delete("/strand/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
