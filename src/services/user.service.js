const User = require('../models/user.model');

exports.create = async(body) => {
    return await User.create(body);
}

exports.getById = async(id) => {
    return await User.findById(id);
}

exports.getAll = async() => {
    return User.find().sort("nom");
}

exports.update = async(id, data) => {
    return await User.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await User.deleteOne({ _id });
}