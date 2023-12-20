const { Order } = require('../models');

exports.create = async(body) => {
    return await Order.create(body);
}

exports.getById = async(id) => {
    return await Order.findById(id)
    .populate("branch")
    .populate("client");
}

exports.getAll = async() => {
    return Order.find()
    .populate("branch")
    .populate("client")
    .sort("-createdAt");
}

exports.getUserOrders = async(client, limit, page, order) => {
    return Order.find({ client })
    .populate("branch")
    .populate("client")
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "createdAt" : "-createdAt");
}

exports.update = async(id, data) => {
    return await Order.findByIdAndUpdate(id, data, {new: true});
}

exports.getBranchOrders = async(branch, limit, page, order) => {
    return Order.find({ branch })
    .populate("branch")
    .populate("client")
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "createdAt" : "-createdAt");
}

exports.delete = async(_id) => {
    return await Order.deleteOne({ _id });
}