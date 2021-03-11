const config = require("config"); // https://www.npmjs.com/package/config

function configuration() {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey not defined.");
  }
}

module.exports = configuration;
