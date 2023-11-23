const { Category } = require('../models');

exports.create = async(body) => {
    return await Category.create(body);
}

exports.getById = async(id) => {
    return await Category.findById(id);
}

exports.getAll = async() => {
    return Category.find().sort("-createdAt");
}

exports.update = async(id, data) => {
    return await Category.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Category.deleteOne({ _id });
}