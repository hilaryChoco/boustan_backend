const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema({
    address: {
        type: String,
        trim: true
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    apartment: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    zipCode: {
        type: String,
        trim: true,
    },
    otp: {
        type: String,
        trim: true,
        default: "saved"
    },
    token: {
        type: String
    },
    loyalties: {
        type: Number,
        default: 0
    },
    deliveryAddress: [ deliveryAddressSchema ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;