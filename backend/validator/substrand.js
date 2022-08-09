const { check } = require("express-validator");

exports.substrandValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("periods")
    .not()
    .isEmpty()
    .isLength({ max: 100 })
    .withMessage("Time allocation is required"),
  check("statement")
    .isLength({ max: 350 })
    .withMessage("The statement should be no more than 350 characters"),
];
