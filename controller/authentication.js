var express=require('express');
const { check, validationResult } = require('express-validator/check');
var statics=require('../constant/static.js');
var messages=require('../constant/message.js');
var ar_messages=require('../constant/arabic_messages.js');
var codes=require('../constant/code.js');
var authenticationService=require('../service/authentication.js');
var authenticationValidator=require('../validator/authentication.js');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
const upload = multer({storage: storage});
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
var router=express.Router();


//login
router.post('/login', function(req,res){

    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }

    var errors = validationResult(req);
    if(errors.array().length==0){
        var creqentials=req.body;

        if(creqentials.email == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_EMAIL,data:null});
        }else if(creqentials.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_PASS,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.login(creqentials.email, creqentials.password).then(user => {

                    resolve(user);
                    if(user == null){
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.INVALID_DATA,
                            message: trans_message.DATA_NOT_FOUND,
                            data: user
                        });
                    }else{

                        if(user.active == null){
                            var userdata = {
                                id: user.user_admin_id,
                                username: user.name,
                                email: user.email

                            }

                            var token = jwt.sign(userdata, 'secretkey', {

                            });
                            authenticationService.login_token(user.user_admin_id, token);
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.USER_FOUND,
                                message: trans_message.ACTIVATION,
                                data: null,
                                token: token
                            });
                        }else {

                            var userdata = {
                                id: user.user_admin_id,
                                username: user.name,
                                email: user.email

                            }

                            var token = jwt.sign(userdata, 'secretkey', {

                            });
                            authenticationService.login_token(user.user_admin_id, token);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: trans_message.DATA_FOUND,
                                data: user,
                                token: token
                            });
                        }
                    }


                }, error => {
                    reject(error);
                });
            });

        }
    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});
//register
router.post('/register', function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var errors = validationResult(req);
    if(errors.array().length==0){
        var creqentials=req.body;

        if(creqentials.email == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_EMAIL,data:null});
        }else if(creqentials.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_PASS,data:null});
        }else if(creqentials.first_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_FIRST,data:null});
        }else if(creqentials.last_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_LAST,data:null});
        }else if(creqentials.phone == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_PHONE,data:null});
        }else{

            return new Promise(function (resolve, reject) {

                authenticationService.check_user(creqentials.email,creqentials.password,creqentials.first_name,creqentials.last_name,creqentials.phone,creqentials.user_type).then(user => {

                    resolve(user);

                    if(user == null){
                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMAIL_REGISTEreq,data:null});
                    }else{
                        var userdata = {
                            id: user.id,
                            email: user.email,
                            username: user.password,

                        }
                        var token = jwt.sign(userdata, 'secretkey', {});
                        authenticationService.login_token(user.id, token);

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'muhammad.umer9122@gmail.com',
                                pass: 'Addidas9122334455?'
                            }
                        });

                        const mailOptions = {
                            from: 'muhammad.umer9122@gmail.com', // sender address
                            to: user.email, // list of receivers
                            subject: 'Subject of your email', // Subject line
                            html: '<p>Your OTP here '+ user.otp +'</p>'// plain text body
                        };

                        transporter.sendMail(mailOptions, function (err, info) {
                            if(err)
                                console.log(err)
                            else
                                console.log(info);
                        });

                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: trans_message.REGISTEreq_USER,
                            data: user,
                            token:token
                        });
                    }


                }, error => {
                    reject(error);
                });
            });

        }

    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});
//activate
router.put('/activate', function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var errors = validationResult(req);
    if(errors.array().length==0){
        var headerdata=req.headers;
        console.log(headerdata);
        var otp=req.body;

        if(otp.otp == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_OTP,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_otp(headerdata.token,otp.otp).then(user => {

                    resolve(user);

                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.INVALID_OTP,data:null});

                    }else{
                        authenticationService.activate_user(headerdata.token, otp.otp).then(user => {

                            resolve(user);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: trans_message.ACTIVATED_USER,
                                data: user,
                            });

                        }, error => {
                            reject(error);
                        });
                    }


                }, error => {
                    reject(error);
                });



                }, error => {
                    reject(error);
                });


        }
    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});
// change password
router.put('/change_pass', function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var errors = validationResult(req);
    if(errors.array().length==0){
        var headerdata=req.headers;
        var password=req.body;

        if(password.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_PASS,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_token(headerdata.token).then(user => {

                    resolve(user);
                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.INVALID_TOKEN,data:null});

                    }else{
                        authenticationService.change_pass(headerdata.token,password.password).then(user => {

                            resolve(user);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: trans_message.CHANGE_PASS,
                                data: user,
                            });

                        }, error => {
                            reject(error);
                        });
                    }


                }, error => {
                    reject(error);
                });



            }, error => {
                reject(error);
            });


        }
    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});
//logout
router.post('/logout',function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    authenticationService.logout();
    res.json({status:statics.STATUS_SUCCESS,code:codes.SUCCESS,message:trans_message.LOGOUT_SUCCESS,data:null});
});
// get profile
router.get('/profile', function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var headerdata=req.headers;

    var errors = validationResult(req);
    if(errors.array().length==0){
            return new Promise(function (resolve, reject) {
                authenticationService.check_token(headerdata.token).then(user => {
                    resolve(user);
                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.INVALID_TOKEN,data:null});

                    }else{
                        authenticationService.get_user(headerdata.token).then(user => {
                            resolve(user);
                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: trans_message.DATA_FOUND,
                                data: user,
                            });
                        }, error => {
                            reject(error);
                        });
                    }
                }, error => {
                    reject(error);
                });
            }, error => {
                reject(error);
            });
        }
});
// update profile
router.put('/update_profile', upload.single('picture'), function(req,res){

    var path = req.file.path;
    console.log(path);

    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }

    var errors = validationResult(req);
    if(errors.array().length==0){
        var headerdata=req.headers;
        var data=req.body;

        if(data.first_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_FIRST,data:null});
        }else if(data.last_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_LAST,data:null});
        }else if(data.address == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_ADDRESS,data:null});
        }else if(data.phone == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_PHONE,data:null});
        }else if(data.lattitude == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_LAT,data:null});
        }else if(data.longitude == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_LONG,data:null});
        }else if(data.company_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_COMPANY,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_token(headerdata.Authentication).then(user => {



                    resolve(user);
                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.INVALID_TOKEN,data:null});

                    }else{
                        authenticationService.update_profile(headerdata.Authentication,data.first_name,data.last_name,data.address,data.phone,path,data.lattitude,data.longitude,data.company_name).then(user => {

                            resolve(user);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: trans_message.PROFILE_UPDATE,
                                data: user,
                            });

                        }, error => {
                            reject(error);
                        });
                    }


                }, error => {
                    reject(error);
                });



            }, error => {
                reject(error);
            });


        }
    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});
//resend code
router.put('/resend_code', function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var errors = validationResult(req);
    if(errors.array().length==0){
        var headerdata=req.headers;

        return new Promise(function (resolve, reject) {

                authenticationService.check_token(headerdata.Authentication).then(user => {

                    resolve(user);
                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.INVALID_TOKEN,data:null});

                    }else{
                        authenticationService.resend_user(headerdata.Authentication).then(user => {

                            resolve(user);

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'muhammad.umer9122@gmail.com',
                                    pass: 'Addidas9122334455?'
                                }
                            });

                            const mailOptions = {
                                from: 'muhammad.umer9122@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Subject of your email', // Subject line
                                html: '<p>Your OTP here '+ user.otp +'</p>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                    console.log(err)
                                else
                                    console.log(info);
                            });

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: trans_message.RESEND,
                                data: user,
                            });

                        }, error => {
                            reject(error);
                        });
                    }


                }, error => {
                    reject(error);
                });



            }, error => {
                reject(error);
            });


        }
});
//reset password
router.post('/reset_password', function(req,res){

    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var errors = validationResult(req);
    if(errors.array().length==0){
        var creqentials=req.body;

        if(creqentials.email == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_EMAIL,data:null});
        }else{

            return new Promise(function (resolve, reject) {

                authenticationService.check_email(creqentials.email).then(user => {

                    resolve(user);
                    console.log(user.email);


                    if(user.email == null){
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.INVALID_DATA,
                            message: trans_message.DATA_NOT_FOUND,
                            data: null
                        });

                    } else {

                        authenticationService.update_otp(user.email).then(user =>{

                            resolve(user);

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'muhammad.umer9122@gmail.com',
                                    pass: 'Addidas9122334455?'
                                }
                            });

                            const mailOptions = {
                                from: 'muhammad.umer9122@gmail.com', // sender address
                                to: user.email, // list of receivers
                                subject: 'Subject of your email', // Subject line
                                html: '<p>Your code for reset password '+ user.otp +'</p>'// plain text body
                            };

                            transporter.sendMail(mailOptions, function (err, info) {
                                if(err)
                                    console.log(err)
                                else
                                    console.log(info);
                            });

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.USER_FOUND,
                                message: trans_message.DATA_FOR_RESET,
                                data: user,
                            });

                            }, error => {
                            reject(error);
                        });


                    }


                }, error => {
                    reject(error);
                });
            });

        }
    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});
// update reset password
router.post('/update_reset_pass', function(req,res){
    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    var errors = validationResult(req);
    if(errors.array().length==0){
        var password=req.body;

        if(password.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_PASS,data:null});
        }else if(password.otp == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:trans_message.EMPTY_FIELD_OTP,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.update_pass(password.otp,password.password).then(user => {

                    resolve(user);

                    if(user == null){
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.FAILURE,
                            message: trans_message.INVALID_OTP,
                            data: user,
                        });
                    }else{
                        res.json({
                            status: statics.STATUS_SUCCESS,
                            code: codes.SUCCESS,
                            message: trans_message.CHANGE_PASS,
                            data: user,
                        });
                    }




                }, error => {
                    reject(error);
                });

            }, error => {
                reject(error);
            });


        }
    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:trans_message.INVALID_DATA,data:errors.array()});

    }
});




module.exports=router;