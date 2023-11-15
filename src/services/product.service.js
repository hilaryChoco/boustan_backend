const Product = require('../models/product.model');

exports.create = async(body) => {
    return await Product.create(body);
}

exports.getByName = async(nom) => {
    return await Product.findOne({ nom });
}

exports.getById = async(id) => {
    return await Product.findById(id);
}

exports.getAll = async() => {
    return Product.find().sort("nom");
}

exports.update = async(id, data) => {
    return await Product.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Product.deleteOne({ _id });
}