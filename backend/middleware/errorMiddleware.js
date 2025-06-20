exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(res.statusCode || 500).json({
    message: err.message || 'Server Error',
  });
};
