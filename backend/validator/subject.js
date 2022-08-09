const { check } = require("express-validator");

exports.subjectValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];
