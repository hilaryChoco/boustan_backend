const { Branch } = require('../models');

exports.create = async(body) => {
    return await Branch.create(body);
}

exports.getById = async(id) => {
    return await Branch.findById(id)
    .populate({
        path: "availableMeals",
        populate: {
            path: "mealId",
            populate: {
                path: "categoryId"
            }
        }
    });
}

exports.getAll = async() => {
    return Branch.find()
    .populate({
        path: "availableMeals",
        populate: {
            path: "mealId"
        }
    })
    .sort("name");
}

exports.update = async(id, data) => {
    return await Branch.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Branch.deleteOne({ _id });
}

exports.getPaginated = async(limit, page, order) => {
    return Branch.find()
    .populate({
        path: "availableMeals",
        populate: {
            path: "mealId"
        }
    })
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "name" : "-name");
}