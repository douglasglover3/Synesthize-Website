const mongoose = require("mongoose");

const ColorSchemeSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    scheme: {
        name: {
            type: String,
            required: true
        },
        notes: {
            type: [String],
            required: true
        }
    }
})

const ColorSchemeModel = mongoose.model("ColorScheme", ColorSchemeSchema, "ColorSchemes")
module.exports = ColorSchemeModel;