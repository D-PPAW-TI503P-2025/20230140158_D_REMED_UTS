const { fail } = require("../utils/response");

module.exports = (err, req, res, next) => {
  console.error("❌ Error:", err);

  // kalau controller melempar error custom: { statusCode, message }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return fail(res, message, statusCode);
};
