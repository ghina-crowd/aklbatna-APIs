var express = require("express");
var bodyparser = require('body-parser');
var morgan = require('morgan');
var UserRouter = require('./controller/users.js');
var CoboneyRouter = require('./controller/coboney');
var DashboardRouter = require('./controller/dashboard');
var MapsRouter = require('./controller/maps');
var AccountRouter = require('./controller/accounts');
var CitiesRouter = require('./controller/cities');
var UploadRouter = require('./controller/upload');
var PurchaseRouter = require('./controller/purchase');
var ContactUsRouter = require('./controller/contactus');
var CompanyRouter = require('./controller/company');
var RequestsRouter = require('./controller/requests');
var AdvertisingRouter = require('./controller/advertising');
var authenticationRouter = require('./controller/authentication.js');
var subcategoriesRouter = require('./controller/sub_categories.js');
var categoriesRouter = require('./controller/categories.js');
var dealsRouter = require('./controller/deals.js');
var defaultMiddleware = require('./middleware/defaultMiddleware.js');
var config = require('./constant/config.js');
var path = require('path');


//need to remove this maybe just for testing in local host.
var cors = require('cors')


var app = express();


//for making image folder
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
app.use('/coboney', CoboneyRouter);
app.use('/dashboard', DashboardRouter);
app.use('/account', AccountRouter);
app.use('/cities', CitiesRouter);
app.use('/upload', UploadRouter);
app.use('/contact', ContactUsRouter);
app.use('/company', CompanyRouter);
app.use('/requests', RequestsRouter);
app.use('/purchase', PurchaseRouter);
app.use('/advertising', AdvertisingRouter);
app.use('/authenticate', authenticationRouter);
app.use('/sub_categories', subcategoriesRouter);
app.use('/categories', categoriesRouter);
app.use('/deals', dealsRouter);
app.use('/maps', MapsRouter);

//for images only
app.use("/images", express.static(__dirname + "/images", { fallthrough: false }));
//Register routers


module.exports = app;