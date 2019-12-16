var express = require("express");
var bodyparser = require('body-parser');
var morgan = require('morgan');
var UserRouter = require('./controller/users.js');
var MapsRouter = require('./controller/maps');
var AccountRouter = require('./controller/accounts');
var UploadRouter = require('./controller/upload');
var PurchaseRouter = require('./controller/purchase');
var CompanyRouter = require('./controller/company');
var AdvertisingRouter = require('./controller/advertising');
var authenticationRouter = require('./controller/authentication.js');
var subcategoriesRouter = require('./controller/sub_categories.js');
var categoriesRouter = require('./controller/categories.js');
var dealsRouter = require('./controller/deals.js');
var defaultMiddleware = require('./middleware/defaultMiddleware.js');
var config = require('./constant/config.js');

//need to remove this maybe  just for testing in local host.
var cors = require('cors')
var app = express();
app.use(cors())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan(config.PROFILE));

app.use(function (req, res, next) {
    if (req.headers.language) {
        exports.acceptedLanguage = req.headers.language;
    } else {
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
app.use('/account', AccountRouter);
app.use('/upload', UploadRouter);
app.use('/company', CompanyRouter);
app.use('/purchase', PurchaseRouter);
app.use('/advertising', AdvertisingRouter);
app.use('/authenticate', authenticationRouter);
app.use('/sub_categories', subcategoriesRouter);
app.use('/categories', categoriesRouter);
app.use('/deals', dealsRouter);
app.use('/maps', MapsRouter);
//Register routers


module.exports = app;