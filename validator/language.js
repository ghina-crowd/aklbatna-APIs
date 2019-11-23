var en_messages=require('../constant/message.js');
var ar_messages=require('../constant/arabic_messages.js');
const Sequelize = require('sequelize');
var language={
    get_lang: function(lang,type){
        return new Promise(function(resolve,reject) {
            if (lang == 'ar') {
                var messages = ar_messages;
                if (type == 'DATA_FOUND') {
                    resolve(messages.DATA_FOUND);
                } else if (type == 'DATA_NOT_FOUND') {
                    resolve(messages.DATA_NOT_FOUND);
                } else if (type == 'LOGOUT_SUCCESS') {
                    resolve(messages.LOGOUT_SUCCESS);
                } else if (type == 'INVALID_DATA') {
                    resolve(messages.INVALID_DATA);
                } else if (type == 'INVALID_LENGTH') {
                    resolve(messages.INVALID_LENGTH);
                } else if (type == 'SERVER_ERROR') {
                    resolve(messages.SERVER_ERROR);
                } else if (type == 'DATA_SAVED') {
                    resolve(messages.DATA_SAVED);
                } else if (type == 'DATA_NOT_SAVED') {
                    resolve(messages.DATA_NOT_SAVED);
                } else if (type == 'EMPTY_FIELD_EMAIL') {
                    resolve(messages.EMPTY_FIELD_EMAIL);
                } else if (type == 'EMPTY_FIELD_PASS') {
                    resolve(messages.EMPTY_FIELD_PASS);
                } else if (type == 'EMPTY_FIELD_FIRST') {
                    resolve(messages.EMPTY_FIELD_FIRST);
                } else if (type == 'EMPTY_FIELD_LAST') {
                    resolve(messages.EMPTY_FIELD_LAST);
                } else if (type == 'EMPTY_FIELD_PHONE') {
                    resolve(messages.EMPTY_FIELD_PHONE);
                } else if (type == 'EMPTY_FIELD_OTP') {
                    resolve(messages.EMPTY_FIELD_OTP);
                } else if (type == 'INVALID_OTP') {
                    resolve(messages.INVALID_OTP);
                } else if (type == 'ACTIVATION') {
                    resolve(messages.ACTIVATION);
                } else if (type == 'EMAIL_REGISTERED') {
                    resolve(messages.EMAIL_REGISTERED);
                } else if (type == 'REGISTERED_USER') {
                    resolve(messages.REGISTERED_USER);
                } else if (type == 'ACTIVATED_USER') {
                    resolve(messages.ACTIVATED_USER);
                } else if (type == 'INVALID_TOKEN') {
                    resolve(messages.INVALID_TOKEN);
                } else if (type == 'CHANGE_PASS') {
                    resolve(messages.CHANGE_PASS);
                } else if (type == 'EMPTY_FIELD_ADDRESS') {
                    resolve(messages.EMPTY_FIELD_ADDRESS);
                } else if (type == 'EMPTY_FIELD_PIC') {
                    resolve(messages.EMPTY_FIELD_PIC);
                } else if (type == 'EMPTY_FIELD_LAT') {
                    resolve(messages.EMPTY_FIELD_LAT);
                } else if (type == 'EMPTY_FIELD_LONG') {
                    resolve(messages.EMPTY_FIELD_LONG);
                } else if (type == 'EMPTY_FIELD_COMPANY') {
                    resolve(messages.EMPTY_FIELD_COMPANY);
                } else if (type == 'PROFILE_UPDATE') {
                    resolve(messages.PROFILE_UPDATE);
                } else if (type == 'RESEND') {
                    resolve(messages.RESEND);
                } else if (type == 'DATA_FOR_RESET') {
                    resolve(messages.DATA_FOR_RESET);
                } else if (type == 'NO_TOKEN') {
                    resolve(messages.NO_TOKEN);
                } else if (type == 'FAILED_AUTHENTICATE_TOKEN') {
                    resolve(messages.FAILED_AUTHENTICATE_TOKEN);
                } else if (type == 'INVALID_EMAIL') {
                    resolve(messages.INVALID_EMAIL);
                }
            } else if (lang == 'en') {
                var messages = en_messages;
                if (type == 'DATA_FOUND') {
                    resolve(messages.DATA_FOUND);
                } else if (type == 'DATA_NOT_FOUND') {
                    resolve({messahe: messages.DATA_NOT_FOUND});
                } else if (type == 'LOGOUT_SUCCESS') {
                    resolve(messages.LOGOUT_SUCCESS);
                } else if (type == 'INVALID_DATA') {
                    resolve(messages.INVALID_DATA);
                } else if (type == 'INVALID_LENGTH') {
                    resolve(messages.INVALID_LENGTH);
                } else if (type == 'SERVER_ERROR') {
                    resolve(messages.SERVER_ERROR);
                } else if (type == 'DATA_SAVED') {
                    resolve(messages.DATA_SAVED);
                } else if (type == 'DATA_NOT_SAVED') {
                    resolve(messages.DATA_NOT_SAVED);
                } else if (type == 'EMPTY_FIELD_EMAIL') {
                    resolve(messages.EMPTY_FIELD_EMAIL);
                } else if (type == 'EMPTY_FIELD_PASS') {
                    resolve(messages.EMPTY_FIELD_PASS);
                } else if (type == 'EMPTY_FIELD_FIRST') {
                    resolve(messages.EMPTY_FIELD_FIRST);
                } else if (type == 'EMPTY_FIELD_LAST') {
                    resolve(messages.EMPTY_FIELD_LAST);
                } else if (type == 'EMPTY_FIELD_PHONE') {
                    resolve(messages.EMPTY_FIELD_PHONE);
                } else if (type == 'EMPTY_FIELD_OTP') {
                    resolve(messages.EMPTY_FIELD_OTP);
                } else if (type == 'INVALID_OTP') {
                    resolve(messages.INVALID_OTP);
                } else if (type == 'ACTIVATION') {
                    resolve(messages.ACTIVATION);
                } else if (type == 'EMAIL_REGISTERED') {
                    resolve(messages.EMAIL_REGISTERED);
                } else if (type == 'REGISTERED_USER') {
                    resolve(messages.REGISTERED_USER);
                } else if (type == 'ACTIVATED_USER') {
                    resolve(messages.ACTIVATED_USER);
                } else if (type == 'INVALID_TOKEN') {
                    resolve(messages.INVALID_TOKEN);
                } else if (type == 'CHANGE_PASS') {
                    resolve(messages.CHANGE_PASS);
                } else if (type == 'EMPTY_FIELD_ADDRESS') {
                    resolve(messages.EMPTY_FIELD_ADDRESS);
                } else if (type == 'EMPTY_FIELD_PIC') {
                    resolve(messages.EMPTY_FIELD_PIC);
                } else if (type == 'EMPTY_FIELD_LAT') {
                    resolve(messages.EMPTY_FIELD_LAT);
                } else if (type == 'EMPTY_FIELD_LONG') {
                    resolve(messages.EMPTY_FIELD_LONG);
                } else if (type == 'EMPTY_FIELD_COMPANY') {
                    resolve(messages.EMPTY_FIELD_COMPANY);
                } else if (type == 'PROFILE_UPDATE') {
                    resolve(messages.PROFILE_UPDATE);
                } else if (type == 'RESEND') {
                    resolve(messages.RESEND);
                } else if (type == 'DATA_FOR_RESET') {
                    resolve(messages.DATA_FOR_RESET);
                } else if (type == 'NO_TOKEN') {
                    resolve(messages.NO_TOKEN);
                } else if (type == 'FAILED_AUTHENTICATE_TOKEN') {
                    resolve(messages.FAILED_AUTHENTICATE_TOKEN);
                } else if (type == 'INVALID_EMAIL') {
                    resolve(messages.INVALID_EMAIL);
                }
            }
        });
    }
};

module.exports=language;
