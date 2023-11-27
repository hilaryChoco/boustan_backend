require("dotenv").config();
const express = require('express');
const app = express();
const session = require('express-session');
const api_doc = require('./api-doc/doc');
const morgan = require ('morgan')

const routes = require("./src/routes");

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    
    next();
});

app.use(
  session({
    secret: 'boustan fast food',
    resave: false,
    saveUninitialized: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api-docs', api_doc);

app.use('/api', routes);

app.get('/', (req, res) => {
  return res.send("API server started successfully!")
});

app.get("*", (req, res) => {
  return res.status(404).json({
    message: "API endpoint not found"
    });
});




/****************** Errors handler ************************/

app.use((req,res,next)=>{

  const error = new Error('Not found');
  error.status = 404;
  next(error);

});


app.use((error, req, res, next)=>{

  res.status(error.status || 500);
  res.json({

    error:{
      message:error.message
    }
  });
  
});


/*********************************************************/


module.exports = app;