const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import User model
const User = require("./models/User.js");

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

app.post("/users/register", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (await User.findOne({username})) {
            throw new Error(`Username ${username} is already taken`);
        }
        
        const newUserData = new User({username, password});
        const newUser = await newUserData.save();

        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.listen(port, () => {
    console.log("Server is working.");
});