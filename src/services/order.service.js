const { Order } = require('../models');

exports.create = async(body) => {
    return await Order.create(body);
}

exports.getById = async(id) => {
    return await Order.findById(id);
}

exports.getAll = async() => {
    return Order.find().sort("-createdAt");
}

exports.getUserOrders = async(client, limit, page, order) => {
    return Order.find({ client })
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "createdAt" : "-createdAt");
}

exports.update = async(id, data) => {
    return await Order.findByIdAndUpdate(id, data, {new: true});
}
