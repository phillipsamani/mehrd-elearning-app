const express = require("express");
const router = express.Router();
const {
  create,
  list,
  // listCategoryWithAllSyllabuses,
  read,
  readCategory,
  remove,
} = require("../controllers/category");

// validators
const { runValidation } = require("../validator");
const { categoryValidator } = require("../validator/category");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post(
  "/category",
  // categoryValidator,
  // runValidation,
  // requireSignin,
  // adminMiddleware,
  create
);

router.get("/categories", list);
router.get("/category/:slug", read);
router.post("/category/:slug", readCategory);
//router.post("/category-syllabuses/:slug", listCategoryWithAllSyllabuses);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
