const { mealService, categoryService, optionService } = require('../services');


exports.create = async (req, res) => {
    try {
        const { name, uri, price, optionIds, categoryId } = req.body;

        let category = await categoryService.getById(categoryId);
        if(!category) {
            return res.status(404).json({
                type: "error",
                message: "Category not recognized"
            });
        }

        let options = await optionService.getAll();
        options = options.map(item => item._id.toString());
        for (const id of optionIds) {
            if( !(options.includes(id)) ) {
                return res.status(404).json({
                    type: "error",
                    message: "Some options are not recognized"
                });
            }
        };

        let meal = await mealService.create({ name, uri, price, optionIds, categoryId });
        if(!meal) {
            return res.status(500).json({
                type: "error",
                message: "Meal creation failure"
            });
        }

        return res.status(201).json({
            type: "success",
            message: "Meal successfully created",
            data: meal
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
        let { name, uri, price, optionIds, categoryId } = req.body;

        let meal = await mealService.getById(id);
        if(!meal) {
            return res.status(404).json({
                type: "error",
                message: "Meal not found"
            });
        }

        let category = await categoryService.getById(categoryId);
        if(!category) {
            return res.status(404).json({
                type: "error",
                message: "Category not recognized"
            });
        }

        let options = await optionService.getAll();
        options = options.map(item => item._id.toString());
        for (const id of optionIds) {
            if( !(options.includes(id)) ) {
                return res.status(404).json({
                    type: "error",
                    message: "Some options are not recognized"
                });
            }
        };

        let updatedMeal = await mealService.update(id, { name, uri, price, optionIds, categoryId });
        if(!updatedMeal) {
            return res.status(500).json({
                type: "error",
                message: "An error occured during meal modification"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Meal successfully modified",
            data: updatedMeal
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

        let meal = await mealService.getById(id);
        if(!meal) {
            return res.status(404).json({
                type: "error",
                message: "Meal not found"
            });
        }

        let deletedMeal = await mealService.delete(id);
        if(!deletedMeal) {
            return res.status(500).json({
                type: "error",
                message: "Meal could not be deleted due to an issue"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Meal successfully deleted"
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
        let meals = await mealService.getAll();

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

exports.getAllByCategoryId = async (req, res) => {
    try {
        let { categoryId, limit, page, order } = req.query;
        let meals = await mealService.getByCategoryId(categoryId, limit, page, order);

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