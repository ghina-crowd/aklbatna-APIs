var en_messages = require('../constant/message.js');
var ar_messages = require('../constant/arabic_messages.js');
const Sequelize = require('sequelize');
var language = {
    get_lang: function (lang, type) {
        return new Promise(function (resolve, reject) {
            var messages;
            if (lang == 'ar') {
                messages = ar_messages;
            } else {
                messages = en_messages;
            }

            if (type == 'DATA_FOUND') {
                resolve({ message: messages.DATA_FOUND });
            } else if (type == 'SUCCESS') {
                resolve({ message: messages.SUCCESS });
            } else if (type == 'DATA_NOT_FOUND') {
                resolve({ message: messages.DATA_NOT_FOUND });
            } else if (type == 'FAILED') {
                resolve({ message: messages.FAILED });
            } else if (type == 'LOGOUT_SUCCESS') {
                resolve({ message: messages.LOGOUT_SUCCESS });
            } else if (type == 'INVALID_DATA') {
                resolve({ message: messages.INVALID_DATA });
            } else if (type == 'INVALID_LENGTH') {
                resolve({ message: messages.INVALID_LENGTH });
            } else if (type == 'SERVER_ERROR') {
                resolve({ message: messages.SERVER_ERROR });
            } else if (type == 'DATA_SAVED') {
                resolve({ message: messages.DATA_SAVED });
            } else if (type == 'DATA_NOT_SAVED') {
                resolve({ message: messages.DATA_NOT_SAVED });
            } else if (type == 'EMPTY_FIELD_EMAIL') {
                resolve({ message: messages.EMPTY_FIELD_EMAIL });
            } else if (type == 'EMPTY_FIELD_PASS') {
                resolve({ message: messages.EMPTY_FIELD_PASS });
            } else if (type == 'EMPTY_FIELD_FIRST') {
                resolve({ message: messages.EMPTY_FIELD_FIRST });
            } else if (type == 'EMPTY_FIELD_LAST') {
                resolve({ message: messages.EMPTY_FIELD_LAST });
            } else if (type == 'EMPTY_FIELD_PHONE') {
                resolve({ message: messages.EMPTY_FIELD_PHONE });
            } else if (type == 'EMPTY_FIELD_OTP') {
                resolve({ message: messages.EMPTY_FIELD_OTP });
            } else if (type == 'INVALID_OTP') {
                resolve({ message: messages.INVALID_OTP });
            } else if (type == 'ACTIVATION') {
                resolve({ message: messages.ACTIVATION });
            } else if (type == 'EMAIL_REGISTERED') {
                resolve({ message: messages.EMAIL_REGISTERED });
            } else if (type == 'REGISTERED_USER') {
                resolve({ message: messages.REGISTERED_USER });
            } else if (type == 'ACTIVATED_USER') {
                resolve({ message: messages.ACTIVATED_USER });
            } else if (type == 'INVALID_TOKEN') {
                resolve({ message: messages.INVALID_TOKEN });
            } else if (type == 'CHANGE_PASS') {
                resolve({ message: messages.CHANGE_PASS });
            } else if (type == 'EMPTY_FIELD_ADDRESS') {
                resolve({ message: messages.EMPTY_FIELD_ADDRESS });
            } else if (type == 'EMPTY_FIELD_PIC') {
                resolve({ message: messages.EMPTY_FIELD_PIC });
            } else if (type == 'EMPTY_FIELD_LAT') {
                resolve({ message: messages.EMPTY_FIELD_LAT });
            } else if (type == 'EMPTY_FIELD_LONG') {
                resolve({ message: messages.EMPTY_FIELD_LONG });
            } else if (type == 'EMPTY_FIELD_COMPANY') {
                resolve({ message: messages.EMPTY_FIELD_COMPANY });
            } else if (type == 'PROFILE_UPDATE') {
                resolve({ message: messages.PROFILE_UPDATE });
            } else if (type == 'RESEND') {
                resolve({ message: messages.RESEND });
            } else if (type == 'DATA_FOR_RESET') {
                resolve({ message: messages.DATA_FOR_RESET });
            } else if (type == 'NO_TOKEN') {
                resolve({ message: messages.NO_TOKEN });
            } else if (type == 'FAILED_AUTHENTICATE_TOKEN') {
                resolve({ message: messages.FAILED_AUTHENTICATE_TOKEN });
            } else if (type == 'INVALID_EMAIL') {
                resolve({ message: messages.INVALID_EMAIL });
            } else if (type == 'MISSING_PAGE_NUMBER') {
                resolve({ message: messages.MISSING_PAGE_NUMBER });
            } else if (type == 'INCORRECT_PASSWORD_USER') {
                resolve({ message: messages.INCORRECT_PASSWORD_USER });
            } else if (type == 'EMPTY_FIELD_USER_ID') {
                resolve({ message: messages.EMPTY_FIELD_USER_ID });
            } else if (type == 'EMPTY_FIELD_OWNER_NAME') {
                resolve({ message: messages.EMPTY_FIELD_OWNER_NAME });
            } else if (type == 'EMPTY_FIELD_CVC') {
                resolve({ message: messages.EMPTY_FIELD_CVC });
            } else if (type == 'EMPTY_FIELD_EXPIRY_DATE') {
                resolve({ message: messages.EMPTY_FIELD_EXPIRY_DATE });
            } else if (type == 'EMPTY_FIELD_CARD_NUMBER') {
                resolve({ message: messages.EMPTY_FIELD_CARD_NUMBER });
            } else if (type == 'EMPTY_FIELD_CARD_TYPE') {
                resolve({ message: messages.EMPTY_FIELD_CARD_TYPE });
            }

        });
    }
};

module.exports = language;
