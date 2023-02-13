const express = require('express');
const router = express.Router();

// Get database models
const User = require("../models/User.js");
const ColorScheme = require("../models/ColorScheme.js");

// Login API
router.post("/users/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if (!user || password !== user.password) {
            throw new Error(`Username or password is incorrect`);
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Register API
router.post("/users/register", async (req, res) => {
    try {
        const {username, password} = req.body;

        if (await User.findOne({username})) {
            throw new Error(`Username '${username}' is already taken`);
        }
        
        const newUserData = new User({username, password});
        const newUser = await newUserData.save();

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get All Schemes API
router.get("/schemes/", async (req, res) => {
    try {
        const {userId} = req.body;
        const allSchemes = await ColorScheme.find(userId ? {userId} : {});
        res.status(200).json(allSchemes);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get all validated Schemes (for showing on main page)
router.post("/validSchemes/", async(req, res) => {
    try {
        const {userId} = req.body;
        const validSchemes = await ColorScheme.find({userId: userId, validated: true});
        res.status(200).json(validSchemes);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get all unvalidated Schemes (for allowing User to validate/delete them)
router.post("/invalidSchemes/", async(req, res) => {
    try {
        const {userId} = req.body;
        const invalidSchemes = await ColorScheme.find({userId: userId, validated: false});
        res.status(200).json(invalidSchemes);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Add Scheme API
router.post("/schemes/", async (req, res) => {
    try {
        const {userId, name, notes} = req.body;

        if (!(await User.findById(userId))) {
            throw new Error("User not found");
        }

        if (await ColorScheme.findOne({userId, name})) {
            throw new Error("A color-scheme with that name already exists");
        }

        const newSchemeData = new ColorScheme({userId, name, notes});
        const newScheme = await newSchemeData.save();

        res.status(201).json(newScheme);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Share Scheme API
router.post("/shareScheme/", async(req, res) => {
    try {
        const {username, name, notes} = req.body;

        // Find the user to send the color-scheme to
        const user = await User.findOne({username});
        if (!user) {
            throw new Error("User not found");
        }

        // Get their _id
        const userId = user._id;

        // Make sure that User doesn't have a color-scheme by that name
        if (await ColorScheme.findOne({userId, name})) {
            throw new Error("That user already has a color scheme with that name");
        }

        // Create this color-scheme but set it as unvalidated
        const newSchemeData = new ColorScheme({userId, name, notes});
        newSchemeData.validated = false;
        const newScheme = await newSchemeData.save();

        res.status(201).json(newScheme);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Validate Scheme API
router.put("/validateScheme/", async(req, res) => {
    try {
        const {userId, name} = req.body;
        if (!(await User.findById(userId))) {
            throw new Error("User not found");
        }

        const scheme = await ColorScheme.findOne({userId, name});
        
        if (!scheme) {
            throw new Error("Color-scheme not found");
        }

        scheme.validated = true;
        const updatedScheme = await scheme.save();
        res.status(200).json(updatedScheme);
    }
    catch(error) {
        res.status(400).json({message: error.message});
    }
});

// Edit Scheme API
router.put("/schemes/", async (req, res) => {
    try {
        const {userId, name, newName, notes} = req.body;

        if (!(await User.findById(userId))) {
            throw new Error("User not found");
        }

        const scheme = await ColorScheme.findOne({userId, name})

        if (!scheme) {
            throw new Error("Color-scheme not found");
        }

        if (newName) {
            if (name != newName && await ColorScheme.findOne({userId, name: newName})) {
                throw new Error("A color-scheme with that name already exists");
            }

            scheme.name = newName;
        }

        if (notes) {
            scheme.notes = notes;
        }

        const updatedScheme = await scheme.save();
        res.status(200).json(updatedScheme);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete Scheme API
router.delete("/schemes/", async (req, res) => {
    try {
        const {userId, name} = req.body;

        if (!(await User.findById(userId))) {
            throw new Error("User not found");
        }

        const scheme = await ColorScheme.findOne({userId, name})

        if (!scheme) {
            throw new Error("Color-scheme not found");
        }

        const deletedScheme = scheme.remove();
        res.status(200).json(deletedScheme);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;