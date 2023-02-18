const express = require("express");
const router = express.Router();
const sha256 = require("js-sha256");

// Get database models
const User = require("../models/User.js");
const ColorScheme = require("../models/ColorScheme.js");

// Route API endpoints
router.post("/login", handle(login));
router.post("/register", handle(register));
router.post("/getAllSchemes", handle(getAllSchemes));
router.post("/getValidSchemes", handle(getValidSchemes));
router.post("/getInvalidSchemes", handle(getInvalidSchemes));
router.post("/addScheme", handle(addScheme));
router.post("/shareScheme", handle(shareScheme));
router.post("/validateScheme", handle(validateScheme));
router.post("/editScheme", handle(editScheme));
router.post("/deleteScheme", handle(deleteScheme));

module.exports = router;

// Handle HTTP status codes and messages
function handle(apiFunction) {
    return async function (req, res) {
        const SUCCESS = 200;
        const ERROR = 400;
        return apiFunction(req.body)
            .then((object) => res.status(SUCCESS).json(object))
            .catch((error) => res.status(ERROR).json({message: error.message}));
    }
}

// Login an existing user
async function login({username, password}) {
    const user = await User.findOne({username});

    if (!user || sha256(password) !== user.password) {
        throw new Error("Username or password is incorrect");
    }

    return user;
}

// Register a new user
async function register({username, password}) {
    if (await User.findOne({username})) {
        throw new Error(`Username '${username}' is already taken`);
    }
    
    const newUserData = new User({username, password: sha256(password)});
    const newUser = await newUserData.save();
    return newUser;
}

// Get all schemes
async function getAllSchemes({userId} = {}) {
    let allSchemes;

    if (userId) {
        allSchemes = await ColorScheme.find({userId});
    } else {
        allSchemes = await ColorScheme.find({});
    }
    
    return allSchemes;
}

// Get all validated Schemes (for showing on main page)
async function getValidSchemes({userId}) {
    const validSchemes = await ColorScheme.find({userId, validated: true});
    return validSchemes;
}

// Get all unvalidated Schemes (for allowing User to validate/delete them)
async function getInvalidSchemes({userId}) {
    const invalidSchemes = await ColorScheme.find({userId, validated: false});
    return invalidSchemes;
}

// Add a scheme
async function addScheme({userId, name, notes}) {
    if (!(await User.findById(userId))) {
        throw new Error("User not found");
    }

    if (await ColorScheme.findOne({userId, name})) {
        throw new Error("A color-scheme with that name already exists");
    }

    const newSchemeData = new ColorScheme({userId, name, notes});
    const newScheme = await newSchemeData.save();
    return newScheme;
}

// Share a scheme
async function shareScheme({username, name, notes}) {
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
    return newScheme;
}

// Validate a scheme
async function validateScheme({userId, name}) {
    if (!(await User.findById(userId))) {
        throw new Error("User not found");
    }

    const scheme = await ColorScheme.findOne({userId, name});
    
    if (!scheme) {
        throw new Error("Color-scheme not found");
    }

    scheme.validated = true;
    const updatedScheme = await scheme.save();
    return updatedScheme;
}

// Edit a scheme
async function editScheme({userId, name, newName, notes}) {
    if (!(await User.findById(userId))) {
        throw new Error("User not found");
    }

    const scheme = await ColorScheme.findOne({userId, name})

    if (!scheme) {
        throw new Error("Color-scheme not found");
    }

    if (newName && (newName !== name)) {
        if (await ColorScheme.findOne({userId, name: newName})) {
            throw new Error("A color-scheme with that name already exists");
        }

        scheme.name = newName;
    }

    if (notes) {
        scheme.notes = notes;
    }

    const updatedScheme = await scheme.save();
    return updatedScheme;
}

// Delete a scheme
async function deleteScheme({userId, name}) {
    if (!(await User.findById(userId))) {
        throw new Error("User not found");
    }

    const scheme = await ColorScheme.findOne({userId, name})

    if (!scheme) {
        throw new Error("Color-scheme not found");
    }

    const deletedScheme = await scheme.remove();
    return deletedScheme;
}