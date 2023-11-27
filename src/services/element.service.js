const { OptionElement } = require('../models');

exports.create = async(body) => {
    return await OptionElement.create(body);
}

exports.getById = async(id) => {
    return await OptionElement.findById(id);
}

exports.getAll = async() => {
    return OptionElement.find().sort("name");
}

exports.update = async(id, data) => {
    return await OptionElement.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await OptionElement.deleteOne({ _id });
}