const mongoose = require("mongoose");

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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;