const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
    },
    coordinates: [{
        type: Number,
    }]
});

const hourSchema = new mongoose.Schema({
    day: {
        type: String,
        trim: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    open: {
        type: Number
    },
    close: {
        type: Number
    }
});

const availabilitySchema = new mongoose.Schema({
    mealId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Meal"
    },
    inPromo: {
        type:Boolean
    },
    promoPrice: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number
    },
    endPromoDate: {
        type: Date
    }
});

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    location: pointSchema,
    hours: [ hourSchema ],
    availableMeals: [ availabilitySchema ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;