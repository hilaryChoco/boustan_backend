const { categoryService } = require('../services');

exports.create = async (req, res) => {
    try {
        const { name, uri } = req.body;

        let category = await categoryService.create({ name, uri });
        if(!category) {
            return res.status(500).json({
                type: "error",
                message: "An error occured during category creation"
            });
        }

        return res.status(201).json({
            type: "success",
            message: "Category successfully created",
            data: category
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
        let { name, uri } = req.body;

        let category = await categoryService.getById(id);
        if(!category) {
            return res.status(404).json({
                type: "error",
                message: "Category not found"
            });
        }

        let updatedCategory = await categoryService.update({ name, uri });
        if(!updatedCategory) {
            return res.status(500).json({
                type: "error",
                message: "An error occured during category modification"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Category successfully modified",
            data: updatedCategory
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

        let category = await categoryService.getById(id);
        if(!category) {
            return res.status(404).json({
                type: "error",
                message: "Category not found"
            });
        }

        if(category.mealIds.length() > 0) {
            return res.status(400).json({
                type: "error",
                message: "Sorry, you cannot delete this category because it contains meals."
            });
        }

        let deletedCategory = await categoryService.delete(id);
        if(!deletedCategory) {
            return res.status(500).json({
                type: "error",
                message: "Category could not be deleted due to an issue"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Category successfully deleted"
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}