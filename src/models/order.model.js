const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number
    }
});

const optionSchema = new mongoose.Schema({
    idOption: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Option"
    },
    nameOption: {
        type: String
    },
    items: [itemSchema]
});

const orderMealSchema = new mongoose.Schema({
    idOrderMeal: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Meal"
    },
    nameOrderMeal: {
        type: String,
        trim: true
    },
    orderMealOptionList: [optionSchema],
    quantity: {
        type: Number
    }
});

const orderSchema = new mongoose.Schema({
    branch: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Branch"
    },
    client: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    orderMeals: [ orderMealSchema ],
    partialPrice: {
        type: Number
    },
    deliveryType: {
        type: String,
        trim: true
    },
    deliveryPrice: {
        type: Number
    },
    tps: {
        type: Number
    },
    tvq: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    rewardOrder: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;