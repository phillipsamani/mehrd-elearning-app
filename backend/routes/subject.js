const express = require("express");
const router = express.Router();
const {
  subjectById,
  create,
  update,
  list,
  read,
  remove,
} = require("../controllers/subject");

// validators
const { runValidation } = require("../validator");
const { subjectValidator } = require("../validator/subject");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/subject", 
  // requireSignin, 
  // adminMiddleware, 
  create);
router.get("/subjects", list);
router.get("/subject/:slug", read);
router.put(
  "/subject/:slug",

  requireSignin,
  adminMiddleware,
  update
);
router.delete("/subject/:slug", requireSignin, adminMiddleware, remove);

router.param("subjectId", subjectById);

module.exports = router;
