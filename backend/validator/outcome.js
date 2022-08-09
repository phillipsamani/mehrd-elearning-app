const { check } = require("express-validator");

exports.outcomeValidator = [
  check("specific")
    .not()
    .isEmpty()
    .isLength({ max: 300 })
    .withMessage("Specific learning outcome statement is required"),
  check("activity")
    .not()
    .isEmpty()
    .isLength({ max: 3000 })
    .withMessage("Activity is required"),
  check("assessment")
    .isLength({ max: 2500 })
    .withMessage("Formative assessment statement is required"),
];
