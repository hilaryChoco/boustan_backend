const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true,
    },
    prix: {
        type: String,
        required: true,
        trim: true,
    },
    prix_promo: {
        type: String,
        trim: true,
    },
    image_url: {
        type: String
    },
    est_en_promotion: { type: Boolean },
    date_insertion: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;