const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        trim: true,
    }
});

const optionSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    max: {
        type: Number
    },
    required: {
        type: Boolean,
    },
    elements: [ elementSchema ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Option = mongoose.model("Option", optionSchema);

module.exports = Option;