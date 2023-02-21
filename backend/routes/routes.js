const express = require("express");
const router = express.Router();
const sha256 = require("js-sha256");

// Get database models
const User = require("../models/User.js");
const ColorScheme = require("../models/ColorScheme.js");

// Parse request bodies as JSON objects
router.use(express.json());

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

// Export router
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

    const userExists = Boolean(user);
    const passwordMatches = () => (sha256(password) === user.password);
    if (!userExists || !passwordMatches()) {
        throw new Error("Username or password is incorrect");
    }

    return user;
}

// Register a new user
async function register({username, password}) {
    const usernameTaken = await User.findOne({username});
    if (usernameTaken) {
        throw new Error(`Username '${username}' is already taken`);
    }
    
    const newUserData = new User({username, password: sha256(password)});
    const newUser = await newUserData.save();
    return newUser;
}

// Get all schemes
async function getAllSchemes({userId}) {
    const allSchemes = await ColorScheme.find({userId});
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
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new Error("User not found");
    }

    const colorSchemeNameTaken = await ColorScheme.findOne({userId, name});
    if (colorSchemeNameTaken) {
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
    const {_id: userId} = user;

    // Make sure that User doesn't have a color-scheme by that name
    const colorSchemeNameTaken = await ColorScheme.findOne({userId, name});
    if (colorSchemeNameTaken) {
        throw new Error("That user already has a color scheme with that name");
    }

    // Create this color-scheme but set it as unvalidated
    const newSchemeData = new ColorScheme({userId, name, notes, validated: false});
    const newScheme = await newSchemeData.save();
    return newScheme;
}

// Validate a scheme
async function validateScheme({userId, name}) {
    const userExists = await User.findById(userId);
    if (!userExists) {
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
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new Error("User not found");
    }

    const scheme = await ColorScheme.findOne({userId, name})
    if (!scheme) {
        throw new Error("Color-scheme not found");
    }

    const nameChangeRequested = newName && (newName !== name)
    if (nameChangeRequested) {
        const newNameTaken = await ColorScheme.findOne({userId, name: newName})
        if (newNameTaken) {
            throw new Error("A color-scheme with that name already exists");
        }

        scheme.name = newName;
    }

    const notesChangeRequested = Boolean(notes);
    if (notesChangeRequested) {
        scheme.notes = notes;
    }

    const updatedScheme = await scheme.save();
    return updatedScheme;
}

// Delete a scheme
async function deleteScheme({userId, name}) {
    const userExists = await User.findById(userId);
    if (!userExists) {
        throw new Error("User not found");
    }

    const scheme = await ColorScheme.findOne({userId, name})
    if (!scheme) {
        throw new Error("Color-scheme not found");
    }

    const deletedScheme = await scheme.remove();
    return deletedScheme;
}