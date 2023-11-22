const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    uri: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        trim: true
    },
    options: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Option"
    }],
    categoryId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Category"
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;