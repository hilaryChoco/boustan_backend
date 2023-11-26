const { Meal } = require('../models');

exports.getMealsOfCategory = async(categoryId) => {
    return Meal.find({ categoryId });
}

exports.getMealsOfOption = async(optionId) => {
    return Meal.find({ options: optionId });
}

exports.create = async(body) => {
    return await Meal.create(body);
}

exports.getById = async(id) => {
    return await Meal.findById(id)
    .populate("categoryId")
    .populate("optionIds");
}

exports.getAll = async() => {
    return Meal.find().sort("name")
    .populate("categoryId")
    .populate("optionIds");
}

exports.update = async(id, data) => {
    return await Meal.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Meal.deleteOne({ _id });
}