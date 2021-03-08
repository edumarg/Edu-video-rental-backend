function admin(req, res, next) {
  if (!req.use.isAdmin) return res.status(403).send("Acces denied");
  next();
}

module.exports = admin;
