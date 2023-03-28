const { coloredLog } = require("../utils/coloredLog");

const responseMiddleware = (req, res, next) => {
  coloredLog(
    [JSON.stringify(req.locals.myData), " In response middleware ", req.originalUrl],
    4
  );
  res.json({
    sent: req.locals.myData,
  });
};

module.exports = { responseMiddleware };
