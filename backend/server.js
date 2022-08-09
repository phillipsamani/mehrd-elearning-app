const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

//variables from config
const config = require("config");
const connectDB = require("./config/db");
const PORT = config.get("PORT");
const nodeEnv = config.get("NODE_ENV");
const clientUrl = config.get("CLIENT_URL");

//routes import

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "100mb", extended: true }));       
// app.use(express.json());
//app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//db connection
connectDB();

//cors
if (nodeEnv === "development") {
  app.use(cors({ origin: `${clientUrl}` }));
}

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);


//port
const port = `${PORT}`;
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
