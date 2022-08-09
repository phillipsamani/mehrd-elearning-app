const { check } = require("express-validator");

exports.strandValidator = [
  check("title").not().isEmpty().withMessage("Title is required"),
  check("statement").not().isEmpty().withMessage("Statement is required"),
];
