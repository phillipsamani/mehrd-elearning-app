const { check } = require("express-validator");

exports.syllabusValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("introduction").not().isEmpty().withMessage("Introduction is required"),
  check("aim").not().isEmpty().withMessage("Aim is required"),
  check("rationale").not().isEmpty().withMessage("Rationale is required"),
];
