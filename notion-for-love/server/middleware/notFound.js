/**
 * Love Journey - Not Found Middleware
 * 
 * Middleware to handle 404 errors for routes that don't exist
 * in the Love Journey API.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { notFound };
