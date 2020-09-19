const { param, check, validationResult } = require('express-validator');

const zombieGetValidationRules = () => {
  return [param('zombieId').isLength({ min: 5 })]
};

const zombiePostValidationRules = () => {
  return [
    check('name').isAlpha().isLength({ min: 2 }).withMessage('Min 2 characters'),
    check('items').isArray({ max: 5 }).withMessage('Max 2 items'),
  ];
};

const zombiePutValidationRules = () => {
  return [
    check('name').notEmpty().bail().isAlpha().isLength({ min: 2 }).withMessage('Min 2 characters'),
    check('items').notEmpty().bail().isArray({ max: 5 }).withMessage('Max 2 items'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  zombieGetValidationRules,
  zombiePostValidationRules,
  zombiePutValidationRules,
  validate,
};
