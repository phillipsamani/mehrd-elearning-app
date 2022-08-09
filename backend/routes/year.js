const express = require("express");
const router = express.Router();
const {
  create,
  list,
  remove,
  // sectionYearSubstrands,
  yearStrandWithSubstrands,
  yearWithRelatedSubstrands,
  getYearWithAllSubstrands,   
  getSectionYearSubstrands
  
} = require("../controllers/year");

// validators
const { runValidation } = require("../validator");
const { yearValidator } = require("../validator/year");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post(
  "/year",
  // yearValidator,    
  // runValidation,  
  // requireSignin,
  // adminMiddleware,   
  create
);
//router.get("/years", list);
router.get("/years", list);
//router.get("/year/:slug", read);
// router.post("/year-substrands/:slug", sectionYearSubstrands);
router.post("/year-substrands/:slug", yearWithRelatedSubstrands);
router.post("/year-syllabus-substrands/:slug", getYearWithAllSubstrands);
router.post("/year-strand-substrands/:slug", yearStrandWithSubstrands);
router.post("/section-year-substrands/:slug", getSectionYearSubstrands);
router.delete("/year/:slug", remove);

module.exports = router;
