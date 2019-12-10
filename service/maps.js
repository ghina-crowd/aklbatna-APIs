
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAl_KkpIB-kNu2GIhc4Kxejd0DDESQWMRM',
    Promise: Promise
});


module.exports = {
    getPlaces: function (address) {
        return new Promise(function (resolve, reject) {
            googleMapsClient.placesQueryAutoComplete({ input: address })
                .asPromise()
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    logger.error(err)
                    reject(err)
                });
        });
    }
};