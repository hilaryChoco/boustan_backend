const mongoose = require("mongoose");

module.exports = () => {

    try {
        mongoose.connect(process.env.DATABASE,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
            console.log("Database connected successfully!");
        });
    } catch (error) {
        console.log("Could not connect to the database!");
        console.log(error);
    }
}