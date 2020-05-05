var express = require('express');
const { validationResult } = require('express-validator/check');
var statics = require('../constant/static.js');
var codes = require('../constant/code.js');
const multer = require('multer');
var languageService = require('../validator/language');
var config = require('../constant/config.js');
const path = require('path');
const Resize = require('../util/Resize');
const jwt = require('jsonwebtoken');
var base64ToImage = require('base64-to-image')
var router = express.Router();
var UserService = require('../service/users.js');
const uniqueString = require('unique-string');





var storage1= multer.diskStorage({
    destination: async (req, file, cb) => {

        if (file.mimetype === 'image/gif') {
            cb(null, './images/');
        }
        if (file.mimetype === 'image/png') {
            cb(null, './images/');
        }
        if (file.mimetype === 'image/jpeg') {
            cb(null, './images/');
        }
        if (file.mimetype === 'application/pdf') {
            cb(null, './files/');
        }
        if (file.mimetype === 'text/plain') {
            cb(null, './images/');
        }



    },
    filename: async (req, file, cb) => {
        // console.log(file);
        var filename = uniqueString();

        if (file.mimetype === 'image/gif') {
            filename = filename + '.gif'
        }
        if (file.mimetype === 'image/png') {
            filename = filename + '.png'
        }
        if (file.mimetype === 'image/jpeg') {
            filename = filename + '.jpg'
        }

        if (file.mimetype === 'application/pdf') {
            filename = filename + '.pdf'
        }

        if (file.mimetype === 'text/plain') {
            filename = filename + '.txt'
        }

        // console.log(filename);
        cb(null, filename);
    }
});



var upload_file = multer({ storage: storage1 });
var storage, crypto;
var fs = require('fs');
crypto = require('crypto');


storage = multer.diskStorage({
    destination: './images/',
    filename: function (req, file, cb) {
        return crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            var filetype = '';
            if (file.mimetype === 'image/png') {
                filetype = 'png';
            }
            if (file.mimetype === 'image/jpeg') {
                filetype = 'jpg';
            }
            if (file.mimetype === 'text/plain') {
                filetype = 'txt';
            }

            return cb(null, "" + uniqueString() + "." + filetype);
        });
    }
});









const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024,
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

router.post(
    "/profile",
    multer({
        storage: storage
    }).single('upload'), async function (req, res) {

        var lang = req.headers.language;
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        console.log(id);

        UserService.update_profile_picture(id, '/images/' + req.file.filename).then(user => {
            if (user) {
                languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
                    var images = {};
                    images['url'] = '/images/' + req.file.filename;
                    res.json({
                        status: statics.STATUS_SUCCESS,
                        code: codes.SUCCESS,
                        message: msg.message,
                        data: images,
                    });
                });
            } else {
                languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                    res.json({
                        status: statics.STATUS_FAILURE,
                        code: codes.FAILURE,
                        message: msg.message,
                    });
                });
            }

        }, error => {
            languageService.get_lang(lang, 'DATA_NOT_FOUND').then(msg => {
                res.json({
                    status: statics.STATUS_FAILURE,
                    code: codes.FAILURE,
                    message: msg.message,
                });
            });
        });


    });

router.post('/images', upload.array('images'), async function (req, res) {


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

                const relative_ptah = '/images/';
                const imagePath = path.join(__dirname, '..' + relative_ptah);
                const fileUpload = new Resize(imagePath, uniqueString() + '.' + filetype);
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




router.post('/base64/file', upload_file.single('base64'), async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;
    console.log(req.file)

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        // await verifyToken(token, res, lang);
        // if (!id) {
        //     return;
        // }

        if (!req.file) {
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


        if (req.file.mimetype === 'text/plain') {
            var relative_ptah = './images/';

            relative_ptah = './images/';
            try {
                relative_ptah = './images/';

                var data = fs.readFileSync(relative_ptah + req.file.filename, 'utf8');
                console.log(data.toString());

                relative_ptah = '/images/';

                var imagePath = path.join(__dirname, '..' + relative_ptah);
                var optionalObj = { 'fileName': uniqueString() + '.png', 'type': 'png' };
                var imageInfo = base64ToImage(data, imagePath, optionalObj);
            } catch (e) {
                console.log('Error:', e.stack);
            }
        }

        var images = {};
        relative_ptah = '/images/';
        images['url'] = relative_ptah + imageInfo.fileName;
        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
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





router.post('/base64', async function (req, res) {


    var lang = req.headers.language;
    var token = req.headers.authorization;

    var errors = validationResult(req);
    if (errors.array().length == 0) {
        var token = req.headers.authorization;
        await verifyToken(token, res, lang);
        if (!id) {
            return;
        }

        if (!req.body.image) {
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


        const relative_ptah = '/images/';
        var base64Str = req.body.image;
        var imagePath = path.join(__dirname, '..' + relative_ptah);
        var optionalObj = { 'fileName': uniqueString() + '.png', 'type': 'png' };
        var imageInfo = base64ToImage(base64Str, imagePath, optionalObj);
        console.log(imageInfo);

        languageService.get_lang(lang, 'DATA_FOUND').then(msg => {
            var images = {};
            images['url'] = relative_ptah + imageInfo.fileName;
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




module.exports = router;
