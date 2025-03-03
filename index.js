const app = require('./app');
const db_connection = require("./db_connection");

db_connection();

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`Follow this link for the Swagger documentation: http://localhost:${port}/api-docs`);
});