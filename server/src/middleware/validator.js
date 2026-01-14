import constants from '../config/constants.js';

const { STATUS_CODES } = constants;

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

/**
 * Validate pagination parameters
 */
export const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid page number'
    });
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid limit (must be between 1 and 100)'
    });
  }
  
  req.pagination = {
    page: pageNum,
    limit: limitNum
  };
  
  next();
};
