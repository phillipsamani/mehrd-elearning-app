const { check } = require("express-validator");

exports.categoryValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("subject").not().isEmpty().withMessage("A subject name is required"),
];
