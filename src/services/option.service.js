const { Option } = require('../models');

exports.create = async(body) => {
    return await Option.create(body);
}

exports.getById = async(id) => {
    return await Option.findById(id)
    .populate("elements");
}

exports.getAll = async() => {
    return Option.find()
    .populate("elements")
    .sort("name");
}

exports.update = async(id, data) => {
    return await Option.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Option.deleteOne({ _id });
}