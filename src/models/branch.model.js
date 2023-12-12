const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere' // Enable 2dsphere index for geospatial queries
    }
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

const deliveryModeSchema = new mongoose.Schema({
    home: {
        type: Boolean,
        default: false
    },
    branch: {
        type: Boolean,
        default: true
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
    deliveryMode: deliveryModeSchema,
    loyalties: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;

// using aggregation get an array of schemaB from schemaA and classify the return data by schemaC id found in schemaB
// i also want ot return other fields of schemaC
// why do I get repeated values of schemaB for some schemaC?