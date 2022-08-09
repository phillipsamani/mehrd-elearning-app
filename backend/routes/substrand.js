const express = require("express");
const router = express.Router();
const {
  substrandById,
  create,
  list,
  read,
  remove,
  listBySearch,
  listSubstrandWithSyllabus,   
  listRelatedSubstrands,
  listRelatedStrands,
  listSubstrandWithStrand,
  listSubstrandWithOutcomes,
} = require("../controllers/substrand");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/substrand", requireSignin, adminMiddleware, create);
router.get("/substrands", list);
router.get("/substrand/:slug", read);
router.post("/substrands/related", listRelatedSubstrands);
router.post("/strand/related", listRelatedStrands);
router.post("/substrands/by/search", listBySearch);
router.post("/substrand-outcomes/:slug", listSubstrandWithOutcomes);
router.post("/substrand-syllabus/related", listSubstrandWithSyllabus);

router.post("/substrand-strand/:slug", listSubstrandWithStrand);
// router.post("/substrands-year/:slug", listYearSubstrands);

router.delete(
  "/substrand/:substrandId",
  requireSignin,
  adminMiddleware,
  remove
);

router.param("substrandId", substrandById);

module.exports = router;
