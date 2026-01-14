import constants from '../config/constants.js';

const { STATUS_CODES } = constants;

/**
 * Success response handler
 */
export const successResponse = (res, data, message = 'Success', statusCode = STATUS_CODES.OK) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

/**
 * Error response handler
 */
export const errorResponse = (res, message = 'Error', statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    status: 'error',
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Paginated response handler
 */
export const paginatedResponse = (res, data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  
  return res.status(STATUS_CODES.OK).json({
    status: 'success',
    message,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      pageSize: limit,
      totalItems: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};
