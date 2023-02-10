const mongoose = require("mongoose");

const ColorSchemeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    notes: {
        type: [String],
        required: true
    }
})

const ColorSchemeModel = mongoose.model("ColorScheme", ColorSchemeSchema, "ColorSchemes")
module.exports = ColorSchemeModel;