const { orderService, branchService, userService, mealService } = require('../services');

exports.saveOrder = async (body) => {
    let client;
    if(body.email) {
        client = await userService.getByEmail(body.email);
        if(!client) {
            return {
                type: "notFoundError",
                message: "Client data not found"
            }
        }
        body.client = client._id;
        delete body.email;
    }
    else {
        client = await userService.getById(body.client);
    }

    let branch = await branchService.getById(body.branch);
    if(!branch) {
        return {
            type: "notFoundError",
            message: "Branch not found"
        }
    }

    let branchMeals = branch.availableMeals.map(item => item.mealId._id.toString());
    for(const meal of body.orderMeals) {
        if( !(branchMeals.includes(meal.idOrderMeal)) ) {
            return {
                type: "notFoundError",
                message: "Some meals are not available in this branch"
            }
        }
    }

    let tps = 0.05;
    let tvq = 0.0995;
    let loyaltyPoint = 0;
    let partialPrice = 0;
    let totalPrice = 0;
    let dbMeals = await mealService.getAll();
    if(body.orderMeals.length > 0) {
        let dbMealIds = dbMeals.map(item => item._id.toString());
        for (const meal of body.orderMeals) {
            if( !(dbMealIds.includes(meal.idOrderMeal)) ) {
                return {
                    type: "notFoundError",
                    message: "Some meals are not recognized"
                }
            }

            if(!body.rewardOrder) {
                let optionsPrice = 0;
                let options = meal.orderMealOptionList;
                let dbMeal = dbMeals.find(x => x._id.toString() === meal.idOrderMeal.toString());
                let dbMealOptions = dbMeal.optionIds;
    
                let optionsExist = options.every(item => dbMealOptions.some(element => item.idOption.toString() === element._id.toString()));
                if(!optionsExist) {
                    return {
                        type: "error",
                        message: "Some options are not available for the meals choosen"
                    }
                }
    
                let itemsExist = options.every(options => {
                    return options.items.every(item => {
                        let optionElementPrice = 0;
                        const dbMealOptionElement = dbMealOptions.some(option => option.elements.find(element => {
                            optionElementPrice = element.price;
                            return item.name === element.name
                        }) )
        
                        return dbMealOptionElement && parseFloat(item.price) === parseFloat(optionElementPrice);
                    });
                });
                if(!itemsExist) {
                    return {
                        type: "error",
                        message: "Some items are not found in these meals or some prices don't match"
                    }
                }
    
                loyaltyPoint += dbMeal.loyalties;
                optionsPrice += parseFloat(options.map(option => {
                    let itemsPrice = 0;
                    option.items.forEach(item => {
                        itemsPrice += parseFloat(item.price);
                    });
                    return itemsPrice;
                }));
                let partial = parseInt(meal.quantity) * (parseFloat(dbMeal.price) + optionsPrice);
                partialPrice += partial;
            }
        };
    }

    if(!body.rewardOrder) {
        totalPrice += partialPrice + parseFloat(body.deliveryPrice) + tps * ((partialPrice + parseFloat(body.deliveryPrice)) / 100) + tvq * ((partialPrice + parseFloat(body.deliveryPrice)) / 100);
    
        if (totalPrice != parseFloat(body.totalPrice) || partialPrice != parseFloat(body.partialPrice)) {
            return {
                type: "error",
                message:"Partial price or total price don't match"
            }
        }
    }

    body.tps = tps;
    body.tvq = tvq;
    let order = await orderService.create(body);
    if(!order) {
        return {
            type: "serverError",
            message: "Order not saved"
        }
    }

    if(!body.rewardOrder) {
        client.loyalties += loyaltyPoint;
        branch.loyalties -= loyaltyPoint;
        await client.save();
        await branch.save();
    }

    return {
        type: "success",
        message: "Order saved",
        data: {
            order,
            clientLoyalties: client.loyalties,
            branchLoyalties: branch.loyalties
        }
    }
}

exports.create = async (req, res) => {
    try {
        let response = await this.saveOrder(req.body);
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
            return res.status(201).json({
                type: "success",
                message: response.message,
                data: response.data
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

exports.getUserOrders = async (req, res) => {
    try {
        let { userId, limit, page, order } = req.query;
        let orders = await orderService.getUserOrders(userId, limit, page, order);

        return res.status(200).json({
            type: "success",
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}