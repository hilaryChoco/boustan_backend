const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["branch", "main"]
    },
    userName: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Branch"
    },
    token: { type: String },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;