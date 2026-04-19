const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === "ECONNREFUSED") {
    return res.status(503).json({
      message: "Database connection refused. Ensure MySQL service is running."
    });
  }
  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(503).json({
      message: "Database authentication failed. Check DB_USER/DB_PASSWORD in .env."
    });
  }
  if (err.code === "ER_BAD_DB_ERROR") {
    return res.status(503).json({
      message: "Database not found. Create schema and set DB_NAME correctly."
    });
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error"
  });
};

module.exports = {
  errorHandler
};
