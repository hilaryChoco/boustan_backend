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
  // return Branch.aggregate([
  //   {
  //     $lookup: {
  //       from: Meal.collection.collectionName,
  //       localField: "availableMeals.mealId",
  //       foreignField: "_id",
  //       as: "meals"
  //     }
  //   },
  //   {
  //     $unwind: "$meals"
  //   },
  //   {
  //     $lookup: {
  //       from: Category.collection.collectionName,
  //       localField: "meals.categoryId",
  //       foreignField: "_id",
  //       as: "category"
  //     }
  //   },
  //   {
  //     $unwind: "$category"
  //   },
  //   {
  //     $group: {
  //       _id: "$category._id",
  //       meals: { $addToSet: "$meals" },
  //       name: { $first: "$category.name" },
  //       uri: { $first: "$category.uri" },
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       name: 1,
  //       uri: 1,
  //       meals: {
  //         $map: {
  //           input: "$meals",
  //           as: "sb",
  //           in: {
  //             _id: "$$sb._id",
  //             name: "$$sb.name",
  //             uri: "$$sb.uri",
  //             price: "$$sb.price",
  //             description: "$$sb.description",
  //             optionIds: "$$sb.optionIds"
  //           }
  //         }
  //       }
  //     }
  //   }
  // ]);


  return Branch.aggregate([
    {
        $unwind: '$availableMeals' // Deconstruct the array
    },
    {
        $lookup: {
            from: Branch.collection.collectionName,
            let: { availableMealsId: '$availableMeals._id' },
            pipeline: [
                {
                    $match: {
                        $expr: { $eq: ['$_id', '$$availableMealsId'] }
                    }
                },
                {
                  $project: {
                    availableMeals: {
                          mealId: 1,
                          inPromo: 1,
                          promoPrice: 1,
                          quantity: 1,
                          endPromoDate: 1,
                          // Add other fields you want to include
                      }
                  }
              }
            ],
            as: 'availableMeals'
        }
    },
    // {
    //   $lookup: {
    //     from: availabilitySchema,
    //     localField: "availableMeals",
    //     foreignField: "_id",
    //     as: "availableMeals"
    //   }
    // },
    // {
    //   $unwind: "$availableMeals"
    // },
    // {
    //   $lookup: {
    //     from: Meal.collection.collectionName,
    //     localField: "availableMeals.mealId",
    //     foreignField: "_id",
    //     as: "meals"
    //   }
    // },
    // {
    //   $unwind: "$meals"
    // },
    // {
    //   $lookup: {
    //     from: Category.collection.collectionName,
    //     localField: "meals.categoryId",
    //     foreignField: "_id",
    //     as: "category"
    //   }
    // },
    // {
    //   $unwind: "$category"
    // },
    // {
    //   $group: {
    //     _id: "$category._id",
    //     meals: { $addToSet: "$meals" },
    //     name: { $first: "$category.name" },
    //     uri: { $first: "$category.uri" },
    //   }
    // },
    // {
    //   $project: {
    //     _id: 1,
    //     name: 1,
    //     uri: 1,
    //     availableMeals: {
    //       $map: {
    //         input: "$availableMeals",
    //         as: "available",
    //         in: {
    //           _id: "$$available._id",
    //           inPromo: "$$available.inPromo",
    //           promoPrice: "$$available.promoPrice",
    //           quantity: "$$available.quantity",
    //           endPromoDate: "$$available.endPromoDate",
    //           meals: {
    //             $map: {
    //               input: "$meals",
    //               as: "sb",
    //               in: {
    //                 _id: "$$sb._id",
    //                 name: "$$sb.name",
    //                 uri: "$$sb.uri",
    //                 price: "$$sb.price",
    //                 loyalties: "$$sb.loyalties",
    //                 description: "$$sb.description",
    //                 optionIds: "$$sb.optionIds"
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //   }
    // }
  ]);


  /**
 * from: The target collection.
 * localField: The local join field.
 * foreignField: The target join field.
 * as: The name for the results.
 * pipeline: Optional pipeline to run on the foreign collection.
 * let: Optional variables to use in the pipeline field stages.
 */
// {
//   from: "branches",
//   localField: 'availableMeals._id',
//   foreignField: 'availabilitySchema._id',
//   as: 'availableMeals',
//   let: { availableMealsId: '$availableMeals._id' },
//   pipeline: [
//     {
//         $match: {
//             $expr: { $eq: ['$_id', '$$availableMealsId'] }
//         }
//     },
//     {
//       $project: {
//         availableMeals: {
//               mealId: 1,
//               inPromo: 1,
//               promoPrice: 1,
//               quantity: 1,
//               endPromoDate: 1,
//               // Add other fields you want to include
//           }
//       }
//   }
// ],
// }


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

// exports.getDistanceBetweenTwoCoordinates = async(coord1, coord2) => {
//   return await Branch.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: 'Point',
//           coordinates: coord1,
//         },
//         distanceField: 'distance',
//         spherical: true,
//         query: {
//           location: {
//             $near: {
//               $geometry: {
//                 type: 'Point',
//                 coordinates: coord2,
//               },
//             },
//           },
//         },
//       },
//     },
//   ]);
// }