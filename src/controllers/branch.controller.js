const { branchService, mealService } = require('../services');


function paginateAndSortAvailableMeals(array, pageNumber, pageSize, order) {
    const sortedArray = array.sort((a, b) => {
        const sortOrderFactor = order.toLowerCase() === 'desc' ? -1 : 1;
        return (a.mealId.name > b.mealId.name ? 1 : -1) * sortOrderFactor;
    });

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return sortedArray.slice(startIndex, endIndex);
}

function getDistanceFromLatLonInKm(coord1, coord2) {
    let lon1 = coord1[0];
    let lat1 = coord1[1];
    let lon2 = coord2[0];
    let lat2 = coord2[1];
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

exports.create = async (req, res) => {
    try {
        let { name, location, hours } = req.body;
        let availableMeals = [];

        let meals = await mealService.getAll();
        meals.forEach(meal => {
            const obj = {
                mealId: meal._id,
                inPromo: false,
                promoPrice: "0",
                quantity: 0
            }
            availableMeals.push(obj);
        });

        let branch = await branchService.create({ name, location, hours, availableMeals });
        if (!branch) {
            return res.status(500).json({
                type: "error",
                message: "Branch creation failure"
            });
        }

        return res.status(201).json({
            type: "success",
            message: "Branch successfully created",
            data: branch
        });
    } catch (error) {
        if (error.code === 16755) {
            return res.status(500).json({
                type: "error",
                message: "Invalid geographic location",
                error: error.stack
            });
        }
        else {
            return res.status(500).json({
                type: "error",
                message: "Server Error",
                error: error.stack
            });
        }
    }
}

exports.modifyAvailableMeals = async (req, res) => {
    try {
        let id = req.query.id;
        let availableMeals = req.body.availableMeals;

        let branch = await branchService.getById(id);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        branch.availableMeals = availableMeals;
        let updatedBranch = await branch.save();
        if (!updatedBranch) {
            return res.status(500).json({
                type: "error",
                message: "Error setting branch available meals"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Success setting branch available meals",
            data: updatedBranch
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.edit = async (req, res) => {
    try {
        let id = req.query.id;
        let { name, location, hours } = req.body;

        let branch = await branchService.getById(id);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        branch.name = name ? name : branch.name;
        branch.location = location ? location : branch.location;
        branch.hours = hours ? hours : branch.hours;
        let updatedBranch = await branch.save();
        if (!updatedBranch) {
            return res.status(500).json({
                type: "error",
                message: "An error occured during branch modification"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Branch successfully modified",
            data: updatedBranch
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.delete = async (req, res) => {
    try {
        let id = req.query.id;

        let branch = await branchService.getById(id);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let deletedBranch = await branchService.delete(id);
        if (!deletedBranch) {
            return res.status(500).json({
                type: "error",
                message: "Branch could not be deleted due to an issue"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Branch successfully deleted"
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getAll = async (req, res) => {
    try {
        let { limit, page, order } = req.query;
        let branches = await branchService.getPaginated(limit, page, order);

        return res.status(200).json({
            type: "success",
            data: branches
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getBranchMeals = async (req, res) => {
    try {
        let { id, limit, page, order } = req.query;

        let branch = await branchService.getById(id);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let branchMeals = branch.availableMeals;
        let meals = paginateAndSortAvailableMeals(branchMeals, page, limit, order);

        return res.status(200).json({
            type: "success",
            data: meals
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.modifyAvailableMealQuantity = async (req, res) => {
    try {
        let { branchId, mealId } = req.query;
        let quantity = req.body.quantity;

        let branch = await branchService.getById(branchId);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let branchMeal = branch.availableMeals.find(x => x.mealId._id.toString() === mealId.toString());
        if (!branchMeal) {
            return res.status(404).json({
                type: "error",
                message: "Meal not found in branch"
            });
        }

        branchMeal.quantity = parseInt(quantity);
        await branch.save();

        return res.status(200).json({
            type: "success",
            message: "Branch meal updated",
            data: branch
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.availableMealPromoPriceAndStatus = async (req, res) => {
    try {
        let { branchId, mealId } = req.query;
        let { status, price, endPromoDate } = req.body;

        endPromoDate = new Date(endPromoDate);
        const currentDate = new Date();
        if (endPromoDate <= currentDate) {
            return res.status(400).json({
                type: "error",
                message: "The promotion ending date must be greater than today."
            });
        }

        let branch = await branchService.getById(branchId);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let branchMeal = branch.availableMeals.find(x => x.mealId._id.toString() === mealId.toString());
        if (!branchMeal) {
            return res.status(404).json({
                type: "error",
                message: "Meal not found in branch"
            });
        }

        branchMeal.inPromo = !!status;
        branchMeal.promoPrice = !status ? null : price;
        branchMeal.endPromoDate = !status ? null : endPromoDate;
        await branch.save();

        return res.status(200).json({
            type: "success",
            message: "Branch meal updated",
            data: branch
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getBranchMealsGroupedByCategory = async (req, res) => {
    try {
        let id = req.query.id;
        let categorizedMeals = [];

        let branch = await branchService.getByIdAsObject(id);
        branch.availableMeals.forEach(availability => {
            let meal = availability.mealId;
            meal.inPromo = availability.inPromo;
            meal.promoPrice = availability.promoPrice;
            meal.quantity = availability.quantity;
            meal.endPromoDate = availability.endPromoDate;
            let category = meal.categoryId;
            delete meal.categoryId;
            let index = categorizedMeals.findIndex(x => x._id.toString() === category._id.toString());
            if(index < 0) {
                let meals = [meal];
                category.meals = meals;
                categorizedMeals.push(category);
            }
            else {
                categorizedMeals[index].meals.push(meal);
            }
        });

        return res.status(200).json({
            type: "success",
            data: categorizedMeals
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.updateDeliveryMode = async (req, res) => {
    try {
        const id = req.query.id;
        let { branch, home } = req.body;
        branch = !!branch;
        home = !!home;

        let exist = await branchService.getById(id);
        if (!exist) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let updatedBranch = await branchService.update(id, { deliveryMode: { branch, home } });
        if (!updatedBranch) {
            return res.status(500).json({
                type: "error",
                message: "Error updating branch delivery mode"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Branch delivery mode updated",
            data: updatedBranch
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.updateLoyaltyPoints = async (req, res) => {
    try {
        const id = req.query.id;
        let loyalties = req.body.loyalties;

        let exist = await branchService.getById(id);
        if (!exist) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let updatedBranch = await branchService.update(id, { loyalties });
        if (!updatedBranch) {
            return res.status(500).json({
                type: "error",
                message: "Error updating branch loyalty point"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Branch loyalty point updated",
            data: updatedBranch
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getNearByBranches = async (req, res) => {
    try {
        let { longitude, latitude } = req.query;
        let coordinates = [Number(longitude), Number(latitude)];

        let branches = await branchService.getNearByBranches(coordinates);

        return res.status(200).json({
            type: "success",
            data: branches
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.query.id;

        let branch = await branchService.getById(id);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        return res.status(200).json({
            type: "success",
            data: branch
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getDistanceBetweenTwoCoordinates = async (req, res) => {
    try {
        let { branchId, longitude, latitude } = req.query;
        let coordinates = [Number(longitude), Number(latitude)];

        let branch = await branchService.getById(branchId);
        if (!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let branchCoordinates = [branch.location.coordinates["0"], branch.location.coordinates["1"]];
        let distance = getDistanceFromLatLonInKm(coordinates, branchCoordinates) * 1000;

        return res.status(200).json({
            type: "success",
            data: distance
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}