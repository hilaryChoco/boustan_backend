const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    nbLoyalties: {
        type: Number,
    },
    meals: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Meal"
    }],
    date: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;