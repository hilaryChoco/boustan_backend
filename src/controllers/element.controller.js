const { elementService, optionService } = require('../services');


exports.create = async (req, res) => {
    try {
        const { name, price } = req.body;

        let element = await elementService.create({ name, price });
        if(!element) {
            return res.status(500).json({
                type: "error",
                message: "Element creation failure"
            });
        }

        return res.status(201).json({
            type: "success",
            message: "Element successfully created",
            data: element
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
        let { name, price } = req.body;

        let element = await elementService.getById(id);
        if(!element) {
            return res.status(404).json({
                type: "error",
                message: "Element not found"
            });
        }

        let updatedElement = await elementService.update(id, { name, price });
        if(!updatedElement) {
            return res.status(500).json({
                type: "error",
                message: "An error occured during element modification"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Element successfully modified",
            data: updatedElement
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

        let element = await elementService.getById(id);
        if(!element) {
            return res.status(404).json({
                type: "error",
                message: "Element not found"
            });
        }

        let elementOptions = await optionService.getOptionsOfElement(id);
        if(elementOptions.length > 0) {
            return res.status(400).json({
                type: "error",
                message: "Sorry, you cannot delete this element because it belongs to some options."
            });
        }

        let deletedElement = await elementService.delete(id);
        if(!deletedElement) {
            return res.status(500).json({
                type: "error",
                message: "Element could not be deleted due to an issue"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Element successfully deleted"
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
        let elements = await elementService.getAll();

        return res.status(200).json({
            type: "success",
            data: elements
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}