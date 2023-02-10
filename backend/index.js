const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import User model
const User = require("./models/User.js");
const ColorScheme = require("./models/ColorScheme.js");

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
        const {username, password} = req.body;

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

app.post("/schemes/add", async (req, res) => {
    try {
        const {user_id, name, notes} = req.body;

        if (!(await User.findById(user_id))) {
            throw new Error("User not found");
        }

        if (await ColorScheme.findOne({user_id, name}))
        {
            throw new Error("A color-scheme with that name already exists");
        }

        const newSchemeData = new ColorScheme({user_id, name, notes});
        const newScheme = await newSchemeData.save();

        res.status(201).json(newScheme);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.listen(port, () => {
    console.log("Server is working.");
});