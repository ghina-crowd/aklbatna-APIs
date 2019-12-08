var express = require("express");
var bodyparser = require('body-parser');
var morgan = require('morgan');
var UserRouter = require('./controller/users.js');
var authenticationRouter = require('./controller/authentication.js');
var subcategoriesRouter = require('./controller/sub_categories.js');
var categoriesRouter = require('./controller/categories.js');
var dealsRouter = require('./controller/deals.js');
var defaultMiddleware = require('./middleware/defaultMiddleware.js');
var config = require('./constant/config.js');
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(morgan(config.PROFILE));

app.use(function (req, res, next) {
    if(req.headers.language){
        exports.acceptedLanguage = req.headers.language;
    }else{
        exports.acceptedLanguage = 'en'
    }

    defaultMiddleware(req, res);
    next();
});

app.get("/", function (req, res) {
    res.send("Hello World");
});


//Register routers
app.use('/user', UserRouter);
app.use('/authenticate', authenticationRouter);
app.use('/sub_categories', subcategoriesRouter);
app.use('/categories', categoriesRouter);
app.use('/deals', dealsRouter);
//Register routers
//Register routers

module.exports = app;