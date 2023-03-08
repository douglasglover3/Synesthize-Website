const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes.js");
const app = express();

// Get port and mongodb info from .env file
require("dotenv").config();
const port = process.env.PORT;
const mongodb_uri = process.env.MONGODB_URI;

// Connect to database
mongoose.connect(mongodb_uri);

// Allow requests from frontend
app.use(cors());

// Route api requests
app.use("", routes);

// Start listening for requests
app.listen(port, () => {
    console.log("Server is working.");
});