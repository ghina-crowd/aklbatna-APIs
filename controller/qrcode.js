var express = require('express');
const { check, validationResult } = require('express-validator/check');
var languageService = require('../validator/language');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
const jwt = require('jsonwebtoken');
var config = require('../constant/config.js');
const multer = require('multer');
const fs = require('fs'); 
var PurchaseService = require('../service/purcahse');

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});
var router = express.Router();
router.post('/read', async function (req, res) {
    var lang = req.headers.language;                
        req = req.body;
       // req.qr_code = code.result; 
       return new Promise(function (resolve, reject) {
        PurchaseService.UpdatePurchase(req).then(purchase => {
            //resolve(purchase);
            languageService.get_lang(lang, 'SUCCESS').then(msg => {
             if (purchase.status == 1)
             {
                res.json({
                    status: statics.STATUS_SUCCESS,
                    code: codes.SUCCESS,
                    message: msg.message,
                    data: purchase
                });
            }
            else 
            {   res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message:  codes.FAILURE,
                    data: purchase
                });
            }
             
            });
        }, error => {
            reject(error);
        });
    });
});


module.exports = router;