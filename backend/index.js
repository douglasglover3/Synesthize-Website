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

// Login API
app.post("/users/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if (!user || password !== user.password) {
            throw new Error(`Username or password is incorrect`);
        }

        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Register API
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

// Add Scheme API
app.post("/schemes/add", async (req, res) => {
    try {
        const {userID, name, notes} = req.body;

        if (!(await User.findById(userID))) {
            throw new Error("User not found");
        }

        if (await ColorScheme.findOne({userID, name}))
        {
            throw new Error("A color-scheme with that name already exists");
        }

        const newSchemeData = new ColorScheme({userID, name, notes});
        const newScheme = await newSchemeData.save();

        res.status(201).json(newScheme);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Edit Scheme API
app.put("/schemes/edit", async (req, res) => {
    try {
        const {userId, name, newName, notes} = req.body;

        if (!(await User.findById(userId))) {
            throw new Error("User not found");
        }

        const scheme = await ColorScheme.findOne({userId, name})

        if (!scheme)
        {
            throw new Error("Color-scheme not found");
        }

        if (newName)
        {
            if (await ColorScheme.findOne({userId, name: newName}))
            {
                throw new Error("A color-scheme with that name already exists");
            }

            scheme.name = newName;
        }

        if (notes)
        {
            scheme.notes = notes;
        }

        const updatedScheme = await scheme.save();
        res.status(200).json(updatedScheme);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.listen(port, () => {
    console.log("Server is working.");
});