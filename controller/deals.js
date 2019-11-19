var express=require('express');
const { check, validationResult } = require('express-validator/check');
var statics=require('../constant/static.js');
var messages=require('../constant/message.js');
var ar_messages=require('../constant/arabic_messages.js');
var codes=require('../constant/code.js');
var categoryServices=require('../service/deals.js');
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
//categories


module.exports=router;