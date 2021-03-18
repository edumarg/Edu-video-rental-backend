const helmet = require("helemet"); // Helmet helps you secure your Express apps by setting various HTTP headers.It's not a silver bullet, but it can help!
const compression = require("compression"); // compress http requests

function prod(app) {
  app.use(helmet());
  app.use(compression());
}

module.exports = prod;
