const { rewardService, mealService, userService, branchService } = require('../services');
const orderCtrl = require('./order.controller');

exports.create = async (req, res) => {
    try {
        const { nbLoyalties, meals } = req.body;

        let exist = await rewardService.getByLoyaltyPoints(nbLoyalties);
        if(exist) {
            return res.status(400).json({
                type: "error",
                message: "A reward already exist with this loyalty points"
            });
        }

        if(meals.length > 0) {
            let dbMeals = await mealService.getAll();
            dbMeals = dbMeals.map(item => item._id.toString());
            for (const id of meals) {
                if( !(dbMeals.includes(id)) ) {
                    return res.status(404).json({
                        type: "error",
                        message: "Some meals are not recognized"
                    });
                }
            };
        }

        let reward = await rewardService.create({ nbLoyalties, meals });
        if(!reward) {
            return res.status(500).json({
                type: "error",
                message: "Reward creation failure"
            });
        }

        return res.status(201).json({
            type: "success",
            message: "Reward successfully created",
            data: reward
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
        const id = req.query.id;

        let reward = await rewardService.getById(id);
        if (!reward) {
            return res.status(404).json({
                type: "error",
                message: "Reward not found"
            });
        }

        let deletedReward = await rewardService.delete(id);
        if(!deletedReward) {
            return res.status(500).json({
                type: "error",
                message: "An error has occured, please try again later"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Reward deleted successfully"
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
        let rewards = await rewardService.getPaginated(limit, page, order);

        return res.status(200).json({
            type: "success",
            data: rewards
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.exchangeReward = async (req, res) => {
    try {
        let { userId, branchId, mealId, rewardId, deliveryType, deliveryPrice } = req.body;

        let user = await userService.getById(userId);
        if(!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        let reward = await rewardService.getById(rewardId);
        if(!reward) {
            return res.status(404).json({
                type: "error",
                message: "Reward not found"
            });
        }

        let meal = await mealService.getById(mealId);
        if(!meal) {
            return res.status(404).json({
                type: "error",
                message: "Meal not found"
            });
        }
        let rewardMeals = reward.meals.map(x => x._id.toString());
        if( !(rewardMeals.includes(mealId)) ) {
            return res.status(400).json({
                type: "error",
                message: "Meal not in reward"
            });
        }

        let branch = await branchService.getById(branchId);
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        if(user.loyalties < reward.nbLoyalties) {
            return res.status(400).json({
                type: "error",
                message: "You don't have enough loyalty points"
            });
        }

        if(deliveryType === "branch") {
            user.loyalties -= reward.nbLoyalties;
            branch.loyalties += reward.nbLoyalties;
            await user.save();
            await branch.save();

            let orderData = {
                branch: branchId,
                client: userId,
                partialPrice: 0,
                deliveryType: deliveryType,
                deliveryPrice: deliveryPrice,
                totalPrice: 0,
                rewardOrder: true,
                orderMeals: [
                  {
                    idOrderMeal: mealId,
                    nameOrderMeal: meal.name,
                    quantity: 1
                  }
                ]
            }

            let response = await orderCtrl.saveOrder(orderData);
            if(response.type == "error") {
                return res.status(400).json({
                    type: "error",
                    message: response.message
                });
            }
            else if(response.type == "serverError") {
                return res.status(500).json({
                    type: "error",
                    message: response.message
                });
            }
            else if(response.type == "notFoundError") {
                return res.status(404).json({
                    type: "error",
                    message: response.message
                });
            }
            else if(response.type == "success") {
                response.data.clientLoyalties = user.loyalties;
                response.data.branchLoyalties = branch.loyalties;
                return res.status(201).json({
                    type: "success",
                    message: "Reward successfully exchange",
                    data: response.data
                });
            }
        }
        else {
            // Lauch the payment route for the delivery fee
            return res.status(400).json({
                type: "error",
                message: "Reward exchange with home delivery is not available at the moment, please try again later."
            });
        }
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}