const mongoose = require("mongoose");

const option_itemSchema = new mongoose.Schema({
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

const Option_Item = mongoose.model("Option_Item", option_itemSchema);

module.exports = Option_Item;