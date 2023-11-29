const { Category, Meal } = require('../models');

exports.create = async(body) => {
    return await Category.create(body);
}

exports.getById = async(id) => {
    return await Category.findById(id);
}

exports.getAll = async() => {
    return Category.find().sort("name");
}

exports.update = async(id, data) => {
    return await Category.findByIdAndUpdate(id, data, {new: true});
}

exports.delete = async(_id) => {
    return await Category.deleteOne({ _id });
}

exports.getPaginated = async(limit, page, order) => {
    return Category.find()
    .limit(parseInt(limit) * 1)
    .skip( (parseInt(page) - 1) * parseInt(limit) )
    .sort(order == "asc" ? "name" : "-name");
}

exports.getCategoriesWithTheirMeals = async(limit, page, order) => {
    return Category.aggregate([
        {
          $lookup: {
            from: Meal.collection.collectionName,
            localField: "_id",
            foreignField: "categoryId",
            as: "meals"
          }
        },
        {
          $sort: {
            ["name"]: order == "asc" ? 1 : -1 // 1 for ascending, -1 for descending
          }
        },
        {
          $skip: parseInt(limit) * (parseInt(page) - 1)
        },
        {
          $limit: parseInt(limit)
        },
        {
          $project: {
            _id: 1,
            name: 1,
            uri: 1,
            meals: {
              $map: {
                input: "$meals",
                as: "sb",
                in: {
                  // Include only the fields you need from schemaB
                  _id: "$$sb._id",
                  name: "$$sb.name",
                  uri: "$$sb.uri",
                  price: "$$sb.price",
                }
              }
            }
          }
        }
    ]);
}