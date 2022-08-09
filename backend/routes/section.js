const express = require("express");
const router = express.Router();
const { create, list, read, getSectionWithSyllabus, getSyllabusSection, listSubstrandSyllabusContent} = require("../controllers/section");

const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/section", 
    // requireSignin, 
    // adminMiddleware, 
    create);
router.post("/section-syllabus/:slug", getSectionWithSyllabus);
router.post("/syllabus-section/:slug", getSyllabusSection);
router.post("/section-substrand-syllabus", listSubstrandSyllabusContent);

router.get("/:slug", read);

module.exports = router;
