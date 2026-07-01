const { validationResult } = require('express-validator');

// Checks for validation errors and returns 400 with first error message
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', error: errors.array()[0].msg });
  }
  next();
};

module.exports = validate;
