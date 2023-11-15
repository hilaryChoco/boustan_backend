require("dotenv").config();
const express = require('express');
const app = express();

const routes = require("./src/routes");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api', routes);
app.get("/", (req, res) => {
  return res.send("App Launched!")
})
app.get("*", (req, res) => {
  return res.status(404).json({
    message: "API endpoint not found"
    });
});

console.log("ENV: ", app.get('env'));
process.env.NODE_ENV = app.get('env');

module.exports = app;