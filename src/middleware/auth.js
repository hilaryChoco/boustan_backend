const jwt = require("jsonwebtoken");

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check the secret

exports.isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : "";
        if (!token) {
            return res.status(400).json({
                type: "error",
                message: "A token is required for authentication"
            });
        }
        console.log('Token:', token); // Check the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        return next();
    } catch (error) {
        res.status(401).json({
            type: "error",
            message: 'Invalid Token',
            error: error.stack
        });
    }
};
