const { orderService, branchService, userService } = require('../services');

exports.create = async (req, res) => {
    try {
        let client = await userService.getByEmail(req.body.email);
        if(!client) {
            return res.status(404).json({
                type: "error",
                message: "Client data not found"
            });
        }
        req.body.client = client._id;
        delete req.body.email;

        let branch = await branchService.getById(req.body.branch);
        if(!branch) {
            return res.status(404).json({
                type: "error",
                message: "Branch not found"
            });
        }

        let order = await orderService.create(req.body);
        if(!order) {
            return res.status(500).json({
                type: "error",
                message: "Order not saved"
            });
        }
        
        return res.status(201).json({
            type: "success",
            message: "Order saved",
            data: order
        });
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