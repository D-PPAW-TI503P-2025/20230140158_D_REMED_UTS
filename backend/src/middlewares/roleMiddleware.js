function requireAdmin(req, res, next) {
  const role = req.headers["x-user-role"];
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }
  next();
}

function requireUser(req, res, next) {
  const role = req.headers["x-user-role"];
  const userId = req.headers["x-user-id"];

  if (role !== "user") {
    return res.status(403).json({ message: "Forbidden: user only" });
  }

  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ message: "x-user-id header is required and must be a number" });
  }

  // simpan supaya gampang dipakai controller
  req.userId = Number(userId);
  next();
}

module.exports = { requireAdmin, requireUser };
