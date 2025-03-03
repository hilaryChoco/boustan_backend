const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    description: {
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
    optionIds: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Option"
    }],
    loyalties: {
        type: Number,
        default: 0
    },
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