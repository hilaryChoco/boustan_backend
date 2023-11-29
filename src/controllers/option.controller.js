const { optionService, mealService } = require('../services');


exports.create = async (req, res) => {
    try {
        let { name, max, required, elements } = req.body;
        max = parseInt(max);

        let option = await optionService.create({ name, max, required, elements });
        if(!option) {
            return res.status(500).json({
                type: "error",
                message: "Option creation failure"
            });
        }

        return res.status(201).json({
            type: "success",
            message: "Option successfully created",
            data: option
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
        const id = req.query.id;
        let { name, max, required, elements } = req.body;
        max = parseInt(max);

        let option = await optionService.getById(id);
        if(!option) {
            return res.status(404).json({
                type: "error",
                message: "Option not found"
            });
        }

        let updatedOption = await optionService.update(id, { name, max, required, elements });
        if(!updatedOption) {
            return res.status(500).json({
                type: "error",
                message: "An error occured during option modification"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Option successfully modified",
            data: updatedOption
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

        let option = await optionService.getById(id);
        if(!option) {
            return res.status(404).json({
                type: "error",
                message: "Option not found"
            });
        }

        let optionMeals = await mealService.getMealsOfOption(id);
        if(optionMeals.length > 0) {
            return res.status(400).json({
                type: "error",
                message: "Sorry, you cannot delete this option because it belongs to some meals."
            });
        }

        let deletedOption = await optionService.delete(id);
        if(!deletedOption) {
            return res.status(500).json({
                type: "error",
                message: "Option could not be deleted due to an issue"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Option successfully deleted"
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
        let options = await optionService.getAll();

        return res.status(200).json({
            type: "success",
            data: options
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}