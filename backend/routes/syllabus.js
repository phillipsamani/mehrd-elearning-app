const express = require("express");
const router = express.Router();
const {
  create,
  update,
  list,
  read,
  listSyllabusRelatedStrand,
  listAllSyllabusesWithCategories,
  listAllSyllabusesWithAllContent,
  listRelatedSyllabusesStrand,
  listRelatedSyllabuses,
  listRelatedSyllabusesSection,
  syllabusById,
  remove,
} = require("../controllers/syllabus");

// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/syllabus", 
  // requireSignin, 
  //   adminMiddleware,      
    create);
router.get("/syllabuses", list);
router.get("/syllabus/:slug", read);
router.post("/syllabus-categories", listAllSyllabusesWithCategories);
router.post("/syllabuses/related", listRelatedSyllabuses);
router.post("/syllabuses/sections/related", listRelatedSyllabusesSection);
router.post("/syllabuses/related-strand", listRelatedSyllabusesStrand);
router.get("/syllabus-related-strands/:syllabusId", listSyllabusRelatedStrand);
router.post("/syllabus-content", listAllSyllabusesWithAllContent);

router.put("/syllabus/:slug", requireSignin, adminMiddleware, update);
router.delete("/syllabus/:slug", requireSignin, adminMiddleware, remove);

router.param("syllabusId", syllabusById);

module.exports = router;
