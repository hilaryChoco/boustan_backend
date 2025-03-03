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

        /*const emailData = {
            to: user.email,
            subject: "Authentication code",
            description: `Use this code to log into your account.<br>Code: <b>${otp}</b>`
        }*/

        res.status(200).json({
            type: "success",
            message: "Please check your mails to get your authentication code",
            data: user
        });

       // emailService.sendCode(emailData);

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
        const { email, firstName, name, phone, dateOfBirth, zipCode } = req.body;
        if(!req.body.email) {
            return res.status(400).json({
                type: "error",
                message: "Email address required"
            });
        }
        if (!validateEmail(req.body.email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }
        if ( await userService.isEmailTaken(req.body.email) ) {
            return res.status(400).json({
                type: "error",
                message: "The email you entered is already taken"
            });
        }
        if ( req.body.phone && await userService.isPhoneTaken(phone) ) {
            return res.status(400).json({
                type: "error",
                message: "The phone number you entered is already taken"
            });
        }

        delete req.body.token;
        delete req.body.otp;
        delete req.body.createdAt;
        const user = await userService.create(req.body);
        if (user) {
            const emailData = {
                to: user.email,
                subject: "Welcome to Boustan",
                description: `This mail is to inform you thhat your account has been successfully created on Boustan. Feel free to order your meals and have fun.`
            }

            res.status(201).json({
                type: "success",
                message: "Account successfully created",
                data: user
            });

            /*emailService.sendCode(emailData);*/
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
        if(!req.body.email) {
            return res.status(400).json({
                type: "error",
                message: "Email address required"
            });
        }
        if (!validateEmail(req.body.email)) {
            return res.status(400).json({
                type: "error",
                message: "Invalid email"
            });
        }
        if ( req.body.phone && await userService.isPhoneTaken(req.body.phone) ) {
            return res.status(400).json({
                type: "error",
                message: "The phone number you entered is already taken"
            });
        }

        let user = await userService.getByEmail(req.body.email);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        delete req.body.email;
        delete req.body.token;
        delete req.body.otp;
        delete req.body.createdAt;
        const updatedAccount = await userService.update(user._id, req.body);
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
        const email = req.query.email;
        if(email != req.user.email) {
            return res.status(400).json({
                type: "error",
                message: "You are not allowed to delete this account"
            });
        }
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

exports.getLoyaltyPoint = async (req, res) => {
    try {
        let id = req.query.id;

        let user = await userService.getById(id);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        return res.status(200).json({
            type: "success",
            data: user.loyalties
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.addDeliveryAddress = async (req, res) => {
    try {
        let { userId, address, longitude, latitude, apartment, company } = req.body;

        let user = await userService.getById(userId);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        user.deliveryAddress.push({ address, longitude: parseFloat(longitude), latitude: parseFloat(latitude), apartment, company });
        await user.save();

        return res.status(201).json({
            type: "success",
            message: "Delivery address added successfully",
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

exports.editDeliveryAddress = async (req, res) => {
    try {
        let { userId, addressId } = req.query;
        let { address, longitude, latitude, apartment, company } = req.body;

        let user = await userService.getById(userId);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        let deliveryAddress = user.deliveryAddress.find(item => item._id.toString() === addressId.toString());
        if(!deliveryAddress) {
            return res.status(404).json({
                type: "error",
                message: "Delivery address not found"
            });
        }

        deliveryAddress.address = address ? address : deliveryAddress.address;
        deliveryAddress.longitude = longitude ? longitude : deliveryAddress.longitude;
        deliveryAddress.latitude = latitude ? latitude : deliveryAddress.latitude;
        deliveryAddress.apartment = apartment ? apartment : deliveryAddress.apartment;
        deliveryAddress.company = company ? company : deliveryAddress.company;

        await user.save();

        return res.status(200).json({
            type: "success",
            message: "Delivery address modified successfully",
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

exports.deleteDeliveryAddress = async (req, res) => {
    try {
        let { userId, addressId } = req.query;

        let user = await userService.getById(userId);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        let addressIndex = user.deliveryAddress.findIndex(item => item._id.toString() === addressId.toString());
        if(addressIndex < 0) {
            return res.status(404).json({
                type: "error",
                message: "Delivery address not found"
            });
        }

        user.deliveryAddress.splice(addressIndex, 1);
        await user.save();

        return res.status(200).json({
            type: "success",
            message: "Delivery address successfully deleted"
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}

exports.getUserDeliveryAddresses = async (req, res) => {
    try {
        let userId = req.query.userId;

        let user = await userService.getById(userId);
        if (!user) {
            return res.status(404).json({
                type: "error",
                message: "User not found"
            });
        }

        return res.status(200).json({
            type: "success",
            data: user.deliveryAddress
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server Error",
            error: error.stack
        });
    }
}