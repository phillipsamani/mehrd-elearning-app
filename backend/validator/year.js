const { check } = require("express-validator");

exports.yearValidator = [
  check("name").not().isEmpty().withMessage("Year is required"),
];
