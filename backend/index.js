const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Get port and mongodb info from .env file
require("dotenv").config();
const port = process.env.PORT;
const mongodb_uri = process.env.MONGODB_URI;

// Connect to frontend
const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
mongoose.connect(mongodb_uri);

// Get API routes
const routes = require('./routes/routes.js');
app.use("", routes);

app.listen(port, () => {
    console.log("Server is working.");
});