var express = require("express");
var bodyparser = require('body-parser');
var morgan = require('morgan');
var UserRouter = require('./controller/users.js');
var authenticationRouter = require('./controller/authentication');
var CategoryRouter = require('./controller/Category');
var ContactRouter = require('./controller/Contact');
var FavouriteRouter = require('./controller/Favourite');
var TypeRouter = require('./controller/Types');
var CityRouter = require('./controller/City');
var KitchenRouter = require('./controller/Kitchen');
var AddressRouter = require('./controller/Address');
var OrderRouter = require('./controller/Order')
var AccountsRouter = require('./controller/Accounts')
var MenuRouter = require('./controller/Menu');
var BannerRouter = require('./controller/Banners');
var MealsRouter = require('./controller/Meals');
var AlkabetnaRouter = require('./controller/alkabetna');
var defaultMiddleware = require('./middleware/defaultMiddleware.js');
var config = require('./constant/config.js');
var UploadRouter = require('./controller/upload');
var OffersRouter = require('./controller/Offers');
var SubsRouter = require('./controller/Subscription');
var NotificationsRouter = require('./controller/Notifications');
var SubsRouter = require('./controller/subscribe');

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
    res.send("Alkabetna");
});


//Register routers
app.use('/upload', UploadRouter);
app.use('/user', UserRouter);
app.use('/authenticate', authenticationRouter);
app.use('/category', CategoryRouter);
app.use('/kitchen', KitchenRouter);
app.use('/menu', MenuRouter);
app.use('/banner', BannerRouter);
app.use('/meals', MealsRouter);
app.use('/alkabetna', AlkabetnaRouter);
app.use('/contact', ContactRouter);
app.use('/favourite', FavouriteRouter);
app.use('/type', TypeRouter);
app.use('/city', CityRouter);
app.use('/address', AddressRouter);
app.use('/order', OrderRouter);
app.use('/account', AccountsRouter);
app.use('/offers', OffersRouter);
app.use('/subscription', SubsRouter);
app.use('/notifications', NotificationsRouter);
app.use('/subscribe', SubsRouter);


//for images only
app.use("/images", express.static(__dirname + "/images", { fallthrough: false }));
//Register routers


module.exports = app;