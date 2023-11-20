const mongoose = require("mongoose");

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
    items: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Option_Item"
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Option = mongoose.model("Option", optionSchema);

module.exports = Option;