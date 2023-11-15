const productService = require('../services/product.service');


exports.createProduct = async (req, res) => {
    try {
        const product = await productService.create(req.body);
        if (product) {
            res.status(201).json({
                type: "success",
                message: "Product successfully created",
                data: product
            });
        }
        else {
            return res.status(500).json({
                type: "error",
                message: "Product creation failure"
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

exports.updateProduct = async (req, res) => {
    try {
        let id = req.query.id;
        let product = await productService.getById(id);
        if(!product) {
            return res.status(404).json({
                type: "error",
                message: "Product not found"
            });
        }
        
        const updatedProduct = await productService.update(id, req.body);
        if (updatedProduct) {
            res.status(200).json({
                type: "success",
                message: "Product successfully updated",
                data: updatedProduct
            });
        }
        else {
            return res.status(500).json({
                type: "error",
                message: "Product update failed"
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

exports.getAll = async(req, res) => {
    try {
        let products = await productService.getAll();

        return res.status(200).json({
            type: "success",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.deleteProduct = async(req, res) => {
    try {
        let id = req.query.id;
        let product = await productService.getById(id);
        if(!product) {
            return res.status(404).json({
                type: "error",
                message: "Product not found"
            });
        }

        const deletedProduct = await productService.delete(id);
        if (deletedProduct) {
            res.status(200).json({
                type: "success",
                message: "Product successfully deleted",
            });
        }
        else {
            return res.status(500).json({
                type: "error",
                message: "Product deletion failed"
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