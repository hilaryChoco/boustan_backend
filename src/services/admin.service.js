const { Admin } = require('../models');

exports.isUserNameTaken = async (userName) => {
    const admin = await Admin.findOne({ userName });
    return !!admin;
};

exports.getByUserName = async (userName) => {
    return await Admin.findOne({ userName });
}

exports.create = async(body) => {
    return await Admin.create(body);
}

exports.getById = async(id) => {
    return await Admin.findById(id)
    .select('-password')
    .populate("branch");
}

exports.getAll = async() => {
    return Admin.find()
    .select('-password')
    .populate("branch")
    .sort("-createdAt");
}

exports.getPaginated = async(limit, page, order) => {
    return Admin.find()
    .select('-password')
    .populate("branch")
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "desc" ? "-userName" : "userName");
}

exports.update = async(id, data) => {
    return await Admin.findByIdAndUpdate(id, data, {new: true})
    .select('-password');
}

exports.delete = async(_id) => {
    return await Admin.deleteOne({ _id });
}