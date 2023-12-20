const bcrypt = require('bcrypt');
const { generateToken } = require('../helper/utils');
const { adminService } = require('../services');


exports.login = async (req, res) => {
    try {
        let admin = await adminService.getByUserName(req.body.userName);
        if (!admin) {
            return res.status(404).json({
                type: "error",
                message: "Account not found"
            });
        }

        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) {
            return res.status(400).json({
                type: "error",
                message: "Wrong password"
            });
        }
        const token = generateToken(admin._id, admin.userName);
        if (!token) {
            return res.status(500).json({
                type: "error",
                message: "Error generating token"
            });
        }
        admin = await adminService.update(admin._id, { token });
        if (admin.token !== token) {
            return res.status(500).json({
                type: "error",
                message: "Token not saved"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Login successfull",
            data: admin
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
};

exports.logout = async (req, res) => {
    req.session.destroy();
    return res.status(200).json({
        type: "success",
        message: "Logout successfull"
    });
}

exports.createAccount = async (req, res) => {
    try {
        if(!req.body.userName) {
            return res.status(400).json({
                type: "error",
                message: "Username required"
            });
        }

        if ( await adminService.isUserNameTaken(req.body.userName) ) {
            return res.status(400).json({
                type: "error",
                message: "The username you entered is already taken"
            });
        }

        if(req.body.type.toLowerCase() !== "branch" && req.body.type.toLowerCase() !== "main") {
            return res.status(400).json({
                type: "error",
                message: "Account type not recognized"
            });
        }

        if(req.body.type.toLowerCase() === "main") {
            delete req.body.branch;
        }

        if(req.body.type.toLowerCase() === "branch" && !req.body.branch) {
            return res.status(400).json({
                type: "error",
                message: "Branch is required for a branch account"
            });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        req.body.password = await bcrypt.hash(req.body.password, salt);
        req.body.type = req.body.type.toLowerCase();

        const admin = await adminService.create(req.body);
        if (admin) {
            return res.status(201).json({
                type: "success",
                message: "Account successfully created",
                data: admin
            });
        }
        else {
            return res.status(500).json({
                type: "error",
                message: "Account creation failure"
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

exports.deleteAccount = async (req, res) => {
    try {
        const id = req.query.id;
        if(id.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                type: "error",
                message: "You are not allowed to delete this account"
            });
        }

        let admin = await adminService.getById(id);
        if (!admin) {
            return res.status(404).json({
                type: "error",
                message: "Account not found"
            });
        }

        let deletedAccount = await adminService.delete(id);
        if(!deletedAccount) {
            return res.status(500).json({
                type: "error",
                message: "An error has occured, please try again later"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Account deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.paginateAccountsList = async (req, res) => {
    try {
        let { limit, page, order } = req.query;
        let accounts = await adminService.getPaginated(limit, page, order);

        return res.status(200).json({
            type: "success",
            data: accounts
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}