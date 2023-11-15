const mongoose = require("mongoose");

module.exports = () => {

    console.log(process.env.DATABASE)

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    try {
        mongoose.connect(process.env.DATABASE, connectionParams)
        .then(async () => {
            console.log("Database connected successfully!");
        });
    } catch (error) {
        console.log("Could not connect to the database!");
        console.log(error);
    }
}