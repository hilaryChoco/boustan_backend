const { Branch, Meal, Category } = require('../models');

exports.create = async (body) => {
  return await Branch.create(body);
}

exports.getById = async (id) => {
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

exports.getAll = async () => {
  return Branch.find()
    .populate({
      path: "availableMeals",
      populate: {
        path: "mealId"
      }
    })
    .sort("name");
}

exports.update = async (id, data) => {
  return await Branch.findByIdAndUpdate(id, data, { new: true });
}

exports.delete = async (_id) => {
  return await Branch.deleteOne({ _id });
}

exports.getPaginated = async (limit, page, order) => {
  return Branch.find()
    .populate({
      path: "availableMeals",
      populate: {
        path: "mealId"
      }
    })
    .limit(parseInt(limit) * 1)
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort(order == "asc" ? "name" : "-name");
}

exports.getBranchMealsGroupedByCategory = async (id) => {
  return Branch.aggregate([
    {
      $lookup: {
        from: Meal.collection.collectionName,
        localField: "availableMeals.mealId",
        foreignField: "_id",
        as: "meals"
      }
    },
    {
      $unwind: "$meals"
    },
    {
      $lookup: {
        from: Category.collection.collectionName,
        localField: "meals.categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $group: {
        _id: "$category._id",
        meals: { $addToSet: "$meals" },
        name: { $first: "$category.name" },
        uri: { $first: "$category.uri" },
      }
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
              _id: "$$sb._id",
              name: "$$sb.name",
              uri: "$$sb.uri",
              price: "$$sb.price",
              description: "$$sb.description",
              optionIds: "$$sb.optionIds"
            }
          }
        }
      }
    }
  ]);
}

exports.getNearByBranches = async (coordinates) => {
  return Branch.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: coordinates,
        },
        distanceField: 'distance',
        maxDistance: 100000.0,
        spherical: true
      }
    }
  ]);
}