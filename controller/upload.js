var express = require('express');
const { check, validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
const multer = require('multer');
var languageService = require('../validator/language');
var config = require('../constant/config.js');
const path = require('path');
const Resize = require('../util/Resize');
const jwt = require('jsonwebtoken');
var router = express.Router();
const Jimp = require('jimp');



var storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        if (file.mimetype === 'image/gif') {
            cb(null, './images/companies/');
        }
        if (file.mimetype === 'image/png') {
            cb(null, './images/companies/');
        }
        if (file.mimetype === 'image/jpeg') {
            cb(null, './images/companies/');
        }
        if (file.mimetype === 'application/pdf') {
            cb(null, './files/companies/');
        }

    },
    filename: async (req, file, cb) => {
        // console.log(file);
        var filename = new Date().getTime().toString();
        if (file.mimetype === 'image/gif') {
            filename = filename + '.gif'
        }
        if (file.mimetype === 'image/png') {
            // const imagePath = path.join(__dirname, '..' + '/images/companies/');
            // const fileUpload = new Resize(imagePath, filename + '.' + 'png');
            // filename = await fileUpload.save(req.file.buffer);
            filename = filename + '.png'
        }
        if (file.mimetype === 'image/jpeg') {
            filename = filename + '.jpg'
        }
        if (file.mimetype === 'application/pdf') {
            filename = filename + '.pdf'
        }
        cb(null, filename);
    }
});
var upload_file = multer({ storage: storage });

const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

var router = express.Router();
var id;
async function verifyToken(token, res, lang) {
    id = undefined;
    if (!token) {
        languageService.get_lang(lang, 'NO_TOKEN').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.TOKEN_MISSING,
                message: msg.message,
                auth: false,
                data: null
            });
        });
        return
    }

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.TOKEN_INVALID,
                    message: msg.message,
                    data: null
                });
            });
            return
        }
        id = decoded.id;
        if (!id) {
            languageService.get_lang(lang, 'FAILED_AUTHENTICATE_TOKEN').then(msg => {
                res.send({
                    status: statics.STATUS_FAILURE,
                    code: codes.TOKEN_MISSING,
                    message: msg.message,
                    auth: false,
                    data: null
                });
            });
            return
        }
        return decoded.id;
    });
}


router.post('/deal/images', upload.array('images'), async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.files) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }
        req.file

        //uploading images and save into array
        var temp_images = [];
        if (req.files.length > 0) {
            for (let k in req.files) {


                var filetype = '';
                if (req.files[k].mimetype === 'image/png') {
                    filetype = 'png';
                }
                if (req.files[k].mimetype === 'image/jpeg') {
                    filetype = 'jpg';
                }

                const relative_ptah = '/images/deals/';
                const imagePath = path.join(__dirname, '..' + relative_ptah);
                const fileUpload = new Resize(imagePath, new Date().getTime() + '.' + filetype);
                const filename = await fileUpload.save(req.files[k].buffer);

                const image = await Jimp.read(path.resolve(`${imagePath + filename}`));
                await image.resize(50, 50);
                await image.quality(0.000001);
                let base = await image.getBase64Async(Jimp.MIME_PNG);
                console.log(base)
                temp_images.push(relative_ptah + filename);
            }
        }
        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
            var images = {};
            images['urls'] = temp_images;
            res.json({
                status: statics.STATUS_SUCCESS,
                code: codes.SUCCESS,
                message: msg.message,
                data: images,
            });
        })
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        })
    }

});
router.post('/categories/images', upload.array('images'), async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.files) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }
        req.file

        //uploading images and save into array
        var temp_images = [];
        if (req.files.length > 0) {
            for (let k in req.files) {


                var filetype = '';
                if (req.files[k].mimetype === 'image/png') {
                    filetype = 'png';
                }
                if (req.files[k].mimetype === 'image/jpeg') {
                    filetype = 'jpg';
                }

                const relative_ptah = '/images/categories/';
                const imagePath = path.join(__dirname, '..' + relative_ptah);
                const fileUpload = new Resize(imagePath, new Date().getTime() + '.' + filetype);
                const filename = await fileUpload.save(req.files[k].buffer);
                temp_images.push(relative_ptah + filename);
            }
        }
        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
            var images = {};
            images['urls'] = temp_images;
            res.json({
                status: statics.STATUS_SUCCESS,
                code: codes.SUCCESS,
                message: msg.message,
                data: images,
            });
        })
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        })
    }

});
router.post('/company/images', upload.array('images'), async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.files) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }
        req.file





        //uploading images and save into array
        var temp_images = [];
        if (req.files.length > 0) {
            for (let k in req.files) {


                const relative_ptah = '/images/companies/';

                var filetype = '';
                if (req.files[k].mimetype === 'image/png' || req.files[k].mimetype === 'image/jpeg') {
                    filetype = 'png';
                    const imagePath = path.join(__dirname, '..' + relative_ptah);
                    const fileUpload = new Resize(imagePath, new Date().getTime() + '.' + filetype);
                    const filename = await fileUpload.save(req.files[k].buffer);
                    temp_images.push(relative_ptah + filename);
                } else {
                    filetype = 'pdf';
                    relative_ptah = '/files/companies/';
                }



            }
        }
        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
            var images = {};
            images['urls'] = temp_images;
            res.json({
                status: statics.STATUS_SUCCESS,
                code: codes.SUCCESS,
                message: msg.message,
                data: images,
            });
        })
    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        })
    }

});
router.post('/company/file', upload_file.array('file'), async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;
    console.log(req.files)

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.files) {
            languageService.get_lang(lang, 'EMPTY_FIELD_IMAGE').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                    data: null
                });
            });
            return;
        }


        var temp_images = [];
        if (req.files.length > 0) {
            for (let k in req.files) {
                var relative_ptah = '/images/companies/';
                if (req.files[k].mimetype === 'image/png' || req.files[k].mimetype === 'image/jpeg' || req.files[k].mimetype === 'image/gif') {
                    relative_ptah = '/images/companies/';
                    temp_images.push(relative_ptah + req.files[0].filename);
                } else {
                    relative_ptah = '/files/companies/';
                    temp_images.push(relative_ptah + req.files[0].filename);
                }
            }
        }

        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
            res.json({
                status: statics.STATUS_SUCCESS,
                code: codes.SUCCESS,
                message: msg.message,
                data: temp_images,
            });
        })

    } else {
        languageService.get_lang(lang, 'INVALID_DATA').then(msg => {
            res.json({
                status: statics.STATUS_FAILURE,
                code: codes.INVALID_DATA,
                message: msg.message,
                data: errors.array()
            });
        })
    }

});

module.exports = router;
