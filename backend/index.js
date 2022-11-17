const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")

//Gets port and mongodb info from .env file
require("dotenv").config();
const port = process.env.PORT;
const mongodb_uri = process.env.MONGODB_URI;

//connects to frontend
const app = express()
app.use(cors());

//connects to database
mongoose.connect(mongodb_uri)

app.listen(port, () => {
    console.log("Server is working.");
});
