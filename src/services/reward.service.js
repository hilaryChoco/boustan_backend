const { Reward } = require('../models');

exports.create = async(body) => {
    return await Reward.create(body);
}

exports.getById = async(id) => {
    return await Reward.findById(id)
    .populate("meals");
}

exports.getByLoyaltyPoints = async(nbLoyalties) =>  {
    return await Reward.findOne({ nbLoyalties })
    .populate("meals");
}

exports.getAll = async() => {
    return Reward.find()
    .populate("meals")
    .sort("-date");
}

exports.getPaginated = async(limit, page, order) => {
    return Reward.find()
    .populate("meals")
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "date" : "-date");
}

exports.update = async(id, data) => {
    return await Reward.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Reward.deleteOne({ _id });
}