function error(err, req, res, next) {
  // Log exception
  res.status(500).send("Something failed...");
}

module.exports = error;
