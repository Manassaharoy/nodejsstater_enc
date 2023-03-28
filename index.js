//? Initialize express server
const express = require("express");
const app = express();

//? Routes import
const firstRoute = require("./routes/firstRoute.js");

//? Additional imports
const { errorMiddleware } = require("./middlewares/error.js");
const connectToDatabase = require("./config/connection.js");

//? Environment veriable initialization
const dotenv = require("dotenv");
const {
  decryptionMiddleware,
  encryptionMiddleware,
} = require("./middlewares/encryptAndDecrypt.js");
// const {
//   decryptionMiddleware,
//   encryptionMiddleware,
// } = require("./middlewares/encryptAndDecryptSHA256.js");
const {
  checkDecryption,
  checkEncryption,
} = require("./utils/encryptionsCheck.js");
const { coloredLog } = require("./utils/coloredLog.js");
const { responseMiddleware } = require("./middlewares/sendResponse.js");
dotenv.config();

//? Database connection
connectToDatabase(process.env.DATABASE_URL);

//? Express server monitor
app.use(require("express-status-monitor")());
app.use(express.json());

//? middlewares
app.use(decryptionMiddleware);

//? API points
app.use("/", firstRoute);

app.get("/test", (req, res, next) => {
  coloredLog(req.method, 3);
  next();
});
app.post("/test", (req, res, next) => {
  coloredLog(req.method, 3);
  next();
});

app.use(encryptionMiddleware);
app.use(responseMiddleware);
app.use(errorMiddleware);

//? Starting server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
