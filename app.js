var express=require("express");
var bodyparser=require('body-parser');
var morgan=require('morgan');
var countryRouter=require('./controller/users.js');
var authenticationRouter=require('./controller/authentication.js');
var categoriesRouter=require('./controller/categories.js');
var defaultMiddleware=require('./middleware/defaultMiddleware.js');
var config=require('./constant/config.js');

var app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan(config.PROFILE));

app.use(function(req,res,next){
    defaultMiddleware(req,res);
    next();
});
app.get("/",function(req,res){
    res.send("Hello World");
});
//Register routers
app.use('/country',countryRouter);
app.use('/authenticate',authenticationRouter);
app.use('/deals/categories',categoriesRouter);
//Register routers

module.exports=app;