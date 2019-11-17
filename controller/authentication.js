var express=require('express');
const { check, validationResult } = require('express-validator/check');
var statics=require('../constant/static.js');
var messages=require('../constant/message.js');
var codes=require('../constant/code.js');
var authenticationService=require('../service/authentication.js');
var authenticationValidator=require('../validator/authentication.js');
const jwt = require('jsonwebtoken');
var router=express.Router();

//login
router.post('/login', function(req,res){

    var errors = validationResult(req);
    if(errors.array().length==0){
        var credentials=req.body;

        if(credentials.email == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_EMAIL,data:null});
        }else if(credentials.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_PASS,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.login(credentials.email, credentials.password).then(user => {

                    resolve(user);
                    if(user == null){
                        res.json({
                            status: statics.STATUS_FAILURE,
                            code: codes.INVALID_DATA,
                            message: messages.DATA_NOT_FOUND,
                            data: null
                        });
                    }else{
                        console.log(user.name);
                        if(user.active == null){
                            res.json({
                                status: statics.STATUS_FAILURE,
                                code: codes.USER_FOUND,
                                message: messages.ACTIVATION,
                                data: null
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
                                message: messages.DATA_FOUND,
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
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:messages.INVALID_DATA,data:errors.array()});

    }
});
//register
router.post('/register', function(req,res){

    var errors = validationResult(req);
    if(errors.array().length==0){
        var credentials=req.body;

        if(credentials.email == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_EMAIL,data:null});
        }else if(credentials.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_PASS,data:null});
        }else if(credentials.first_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_FIRST,data:null});
        }else if(credentials.last_name == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_LAST,data:null});
        }else if(credentials.phone == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_PHONE,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_user(credentials.email).then(user => {

                    resolve(user);
                    if(user == null){

                        authenticationService.register_user(credentials.email, credentials.password, credentials.first_name, credentials.last_name, credentials.phone).then(user => {

                            resolve(user);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: messages.REGISTERED_USER,
                                data: user,
                            });

                        }, error => {
                            reject(error);
                        });

                    }else{
                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMAIL_REGISTERED,data:null});
                    }


                }, error => {
                    reject(error);
                });
            });

        }

    }else{
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:messages.INVALID_DATA,data:errors.array()});

    }
});
//activate
router.put('/activate', function(req,res){

    var errors = validationResult(req);
    if(errors.array().length==0){
        var headerdata=req.headers;
        var otp=req.body;

        if(otp.otp == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_OTP,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_otp(headerdata.user_id,otp.otp).then(user => {

                    resolve(user);
                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.INVALID_OTP,data:null});

                    }else{
                        authenticationService.activate_user(headerdata.user_id, otp.otp).then(user => {

                            resolve(user);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: messages.ACTIVATED_USER,
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
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:messages.INVALID_DATA,data:errors.array()});

    }
});
// change password
router.put('/change_pass', function(req,res){

    var errors = validationResult(req);
    if(errors.array().length==0){
        var headerdata=req.headers;
        var password=req.body;

        if(password.password == ''){
            res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.EMPTY_FIELD_PASS,data:null});
        }else {

            return new Promise(function (resolve, reject) {

                authenticationService.check_token(headerdata.token).then(user => {

                    resolve(user);
                    if(user == null){

                        res.json({status:statics.STATUS_FAILURE,code:codes.FAILURE,message:messages.INVALID_TOKEN,data:null});

                    }else{
                        authenticationService.change_pass(headerdata.token,password.password).then(user => {

                            resolve(user);

                            res.json({
                                status: statics.STATUS_SUCCESS,
                                code: codes.SUCCESS,
                                message: messages.CHANGE_PASS,
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
        res.json({status:statics.STATUS_FAILURE,code:codes.INVALID_DATA,message:messages.INVALID_DATA,data:errors.array()});

    }
});
//logout
router.post('/logout',function(req,res){
    authenticationService.logout();
    res.json({status:statics.STATUS_SUCCESS,code:codes.SUCCESS,message:messages.LOGOUT_SUCCESS,data:null});
});

module.exports=router;