// server.js
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const authenticationRoutes = require("./routes/authenticationRoutes");
const authorizedRoutes=require("./routes/authorizedRoutes")
const patientRoutes=require('./routes/patientRoutes')

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3001";
const app = express();

// Middlewares
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,  // Allows cookies to be sent cross-origin if needed
  })
);

app.use(express.json());  // Middleware for parsing JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));  // Logging requests

// MongoDB Connection
mongoose.connect("mongodb+srv://ShreeshGawande:Shreesh10@cluster0.o3pndei.mongodb.net/MediSync")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

// Routes
app.use("/auth/", authenticationRoutes); // Prefixing all routes with /auth
app.use("/users/",authorizedRoutes);
app.use('/patient',patientRoutes)

// Server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
