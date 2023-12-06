const mongoose = require("mongoose");

const orderMealSchema = new mongoose.Schema({
    mealName: {
        type: String,
        trim: true
    },
    optionList: [{
        type: String,
        trim: true
    }],
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;