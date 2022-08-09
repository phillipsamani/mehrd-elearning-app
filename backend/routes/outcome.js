const express = require("express");
const router = express.Router();
const {
  outcomeById,
  create,
  createSpecific,
  list,
  listRelatedOutcomes,
  outcomeWithSubstrandAndStrand,
  outcomeYearSubstrands,
  createNote,
  read,
  photo,
  remove,
} = require("../controllers/outcome");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const { userById } = require("../controllers/user");
router.post("/outcome", requireSignin, adminMiddleware, create);
router.put(
  "/outcome/:outcomeId",
  requireSignin,
  adminMiddleware,
  createSpecific
);
// router.put("/outcome/:outcomeId", requireSignin, createNote);
router.post("/outcomes/related", listRelatedOutcomes);
router.post("/outcome-substrand-strand/:slug", outcomeWithSubstrandAndStrand);
router.post("/outcome-year-substrands/:slug", outcomeYearSubstrands);
router.get("/outcomes", list);
router.get("/outcome/:slug", read);
router.get("/outcome/photo/:slug", photo);
router.delete("/outcome/:slug", requireSignin, adminMiddleware, remove);

router.param("outcomeId", outcomeById);
router.param("userId", userById);

module.exports = router;
