const mongoose = require("mongoose");

const option_elementSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Option_Element = mongoose.model("Option_Element", option_elementSchema);

module.exports = Option_Element;