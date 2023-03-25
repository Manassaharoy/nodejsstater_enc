//? Initialize express server
const express = require("express");
const app = express();

//? Express server monitor
app.use(require("express-status-monitor")());

//? Environment veriable initialization
const dotenv = require("dotenv");
dotenv.config();

//? Routes import
const firstRoute = require("./routes/firstRoute.js");
const { errorMiddleware } = require("./middlewares/error.js");
const connectToDatabase = require("./config/connection.js");

//? Database connection
connectToDatabase(process.env.DATABASE_URL);


//? API points
app.use("/", firstRoute);

app.use(errorMiddleware)

//? Starting server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
