const { User } = require('../models');

exports.isEmailTaken = async (email) => {
    const user = await User.findOne({ email });
    return !!user;
};

exports.isPhoneTaken = async (phone) => {
    const user = await User.findOne({ phone });
    return !!user;
};

exports.create = async(body) => {
    return await User.create(body);
}

exports.getById = async(id) => {
    return await User.findById(id);
}

exports.getByEmail = async(email) => {
    return await User.findOne({ email });
}

exports.getAll = async() => {
    return User.find().sort("-createdAt");
}

exports.getPaginated = async(limit, page, order) => {
    return User.find()
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "createdAt" : "-createdAt");
}

exports.update = async(id, data) => {
    return await User.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(email) => {
    return await User.deleteOne({ email });
}