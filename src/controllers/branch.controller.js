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
        if(!branch) {
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
        if(error.code === 16755) {
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
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        branch.availableMeals = availableMeals;
        let updatedBranch = await branch.save();
        if(!updatedBranch) {
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
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        branch.name = name ? name : branch.name;
        branch.location = location ? location : branch.location;
        branch.hours = hours ? hours : branch.hours;
        let updatedBranch = await branch.save();
        if(!updatedBranch) {
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
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let deletedBranch = await branchService.delete(id);
        if(!deletedBranch) {
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
        if(!branch) {
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
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let branchMeal = branch.availableMeals.find(x => x.mealId._id.toString() === mealId.toString());
        if(!branchMeal) {
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
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let branchMeal = branch.availableMeals.find(x => x.mealId._id.toString() === mealId.toString());
        if(!branchMeal) {
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

        let meals = await branchService.getBranchMealsGroupedByCategory(id);

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

exports.updateDeliveryMode = async (req, res) => {
    try {
        const id = req.query.id;
        let { branch, home } = req.body;
        branch = !!branch;
        home = !!home;

        let exist = await branchService.getById(id);
        if(!exist) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let updatedBranch = await branchService.update(id, { deliveryMode: {branch, home} });
        if(!updatedBranch) {
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
        if(!exist) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let updatedBranch = await branchService.update(id, { loyalties });
        if(!updatedBranch) {
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
        if(!branch) {
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