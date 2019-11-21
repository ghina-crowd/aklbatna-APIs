var express=require('express');
const { check, validationResult } = require('express-validator/check');
var statics=require('../constant/static.js');
var messages=require('../constant/message.js');
var ar_messages=require('../constant/arabic_messages.js');
var codes=require('../constant/code.js');
var categoryServices=require('../service/categories.js');
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

//categories
router.get('/', function(req,res){

    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    return new Promise(function(resolve,reject) {
        categoryServices.get_pro_categories().then(categories => {
            resolve(categories);
            if(categories == null){
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: trans_message.DATA_NOT_FOUND,
                    data: categories,
                });
            }else {
                res.json({
                    status: statics.STATUS_SUCCESS,
                    code: codes.SUCCESS,
                    message: trans_message.DATA_FOUND,
                    data: categories,
                });
            }
        }, error => {
            reject(error);
        });
    });
});
//categories
router.get('/categories', function(req,res){

    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    return new Promise(function(resolve,reject) {
        categoryServices.get_categories().then(categories => {
            resolve(categories);
            if(categories == null){
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: trans_message.DATA_NOT_FOUND,
                    data: categories,
                });
            }else {
                res.json({
                    status: statics.STATUS_SUCCESS,
                    code: codes.SUCCESS,
                    message: trans_message.DATA_FOUND,
                    data: categories,
                });
            }
        }, error => {
            reject(error);
        });
    });
});
//sub_categories
router.get('/sub_categories', function(req,res){

    if(req.headers.language == 'ar'){
        var trans_message = ar_messages;
    }else if(req.headers.language == 'en'){
        var trans_message = messages;
    }else{
        var trans_message = messages;
    }
    return new Promise(function(resolve,reject) {
        categoryServices.get_sub_categories().then(categories => {
            resolve(categories);
            if(categories == null){
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: trans_message.DATA_NOT_FOUND,
                    data: categories,
                });
            }else {
                res.json({
                    status: statics.STATUS_SUCCESS,
                    code: codes.SUCCESS,
                    message: trans_message.DATA_FOUND,
                    data: categories,
                });
            }
        }, error => {
            reject(error);
        });
    });
});


module.exports=router;