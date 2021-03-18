const express = require("express"); // https://www.npmjs.com/package/express
const app = express();
const winston = require("winston"); // https://www.npmjs.com/package/winston

require("./startup/logging")();
require("./startup/config")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/prod")(app);

// Listen for connections
const port = process.env.PORT || 3900;
app.listen(port, () => {
  winston.info(`Listening on port ${port}...`);
});
