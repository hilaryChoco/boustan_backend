const { validateEmail, generateToken, generateCode } = require('../helper/utils');
const { userService, emailService } = require('../services');


exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        if (!validateEmail(email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }

        let user = await userService.getByEmail(email);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        const otp = generateCode();
        user = await userService.update(user._id, { otp });

        const emailData = {
            to: user.email,
            subject: "Authentication code",
            description: `Use this code to log into your account.<br>Code: <b>${otp}</b>`
        }

        res.status(200).json({
            type: "success",
            message: "Please check your mails to get your authentication code",
            data: user
        });

        emailService.sendCode(emailData);
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
        const { email, firstName, name, zipCode } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }
        if ( await userService.isEmailTaken(email) ) {
            return res.status(400).json({
                type: "error",
                message: "The email you entered is already taken"
            });
        }

        const otp = generateCode();
        const user = await userService.create({ email, firstName, name, zipCode, otp });
        if (user) {
            const emailData = {
                to: user.email,
                subject: "Authentication code",
                description: `Use this code to log into your account.<br>Code: <b>${otp}</b>`
            }

            res.status(201).json({
                type: "success",
                message: "Account successfully created",
                data: user
            });

            emailService.sendCode(emailData);
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

exports.editAccount = async (req, res) => {
    try {
        const { email, firstName, name, zipCode } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }

        let user = await userService.getByEmail(email);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        const updatedAccount = await userService.update(user._id, { email, firstName, name, zipCode });
        if(!updatedAccount) {
            return res.status(500).json({
                type: "error",
                message: "Account modification failure"
            });
        }

        return res.status(200).json({
            type: "success",
            message: "Account modification successfull",
            data: updatedAccount
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.validateOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }
        let user = await userService.getByEmail(email);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }
        if(otp.toString() !== user.otp.toString()) {
            return res.status(400).json({
                type: "error",
                message: "Invalid code"
            });
        }
        const token = generateToken(user._id, user.email);
        user = await userService.update(user._id, { token, otp: "saved" });

        return res.status(200).json({
            type: "success",
            message: "Valid code",
            data: user
        });
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
        const email = req.body.email;
        if (!validateEmail(email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }

        let user = await userService.getByEmail(email);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        let deletedAccount = await userService.delete(email);
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
        let accounts = await userService.getPaginated(limit, page, order);

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