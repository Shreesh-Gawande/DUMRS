const express = require("express");
require("dotenv").config();
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const authenticationRoutes=require("./routes/authenticationRoutes")

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();
app.use(express.json());
app.use("/auth",authenticationRoutes);


/* const auth = require("./middlewares/auth");

const patientRoutes = require("./routes/patientRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");
const authorizedRoutes = require("./routes/authorizedRoutes");



// Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookie_parser());
app.use(morgan("dev")); // HTTP request logging

// Routes
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/auth", authenticationRoutes);
app.use("/api/v1", auth, authorizedRoutes); // Protected routes, requires authorization.
app.use("/api/v1/hospital", hospitalRoutes);
 */
// Server

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
