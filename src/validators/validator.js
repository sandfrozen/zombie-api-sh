const { param, check, validationResult } = require('express-validator');

const zombieIdRules = () => {
  return [
    param('zombieId')
      .isLength({ min: 7 })
      .withMessage('Id is too short')
      .isLength({ max: 14 })
      .withMessage('Id is too long'),
  ];
};

const zombiePostRules = () => {
  return [
    check('name')
      .isAlpha()
      .withMessage('Only letters')
      .isLength({ min: 2 })
      .withMessage('Min 2 letters'),
    check('items').isArray({ max: 5 }).withMessage('Max 5 items'),
  ];
};

const zombiePutRules = () => {
  return [
    param('zombieId')
      .isLength({ min: 7 })
      .withMessage('Id is too short')
      .isLength({ max: 14 })
      .withMessage('Id is too long'),
    check('name')
      .isAlpha()
      .withMessage('Only letters')
      .isLength({ min: 2 })
      .withMessage('Min 2 letters'),
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
  zombieIdRules,
  zombiePostRules,
  zombiePutRules,
  validate,
};
