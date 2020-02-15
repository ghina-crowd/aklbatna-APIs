var FavouriteRepository = require('../repository/Favourite');


module.exports = {
    get: function (user_id) {
        return new Promise(function (resolve, reject) {
            FavouriteRepository.get(user_id).then(user => {
                resolve(user);
            }, error => {
                reject(error);
            });
        });
    },
    create: function (newFavouriteData) {

        console.log(newFavouriteData);
        if (newFavouriteData.status === '1' || newFavouriteData.status === 1) {
            console.log('we are creating');
            return new Promise(function (resolve, reject) {
                FavouriteRepository.create(newFavouriteData).then(function (result) {
                    resolve(result);
                }, function (error) {
                    reject(error);
                });
            });
        } else {
            console.log('we are rejecting');
            return new Promise(function (resolve, reject) {
                FavouriteRepository.deletebyUserAndMealID(newFavouriteData).then(delete_response => {
                    resolve(delete_response);
                }, error => {
                    reject(error);
                });
            });
        }


    },
    delete: function (favourite_id) {
        return new Promise(function (resolve, reject) {
            FavouriteRepository.delete(favourite_id).then(delete_response => {
                resolve(delete_response);
            }, error => {
                reject(error);
            });
        });
    }
};