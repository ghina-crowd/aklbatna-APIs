var BannersRepository = require('../repository/Banners');
var CategoryRepository = require('../repository/Category');
var KitchensRepository = require('../repository/Kitchen');
var MealsRepository = require('../repository/Meals');

module.exports = {
    home: async function () {
        return new Promise(async function (resolve, reject) {
            BannersRepository.get().then(banners => {
                CategoryRepository.get_categories().then((kitchens) => {
                    KitchensRepository.get_featured(0).then((kitchensFeatured) => {
                        MealsRepository.get_featured(0).then((Meals) => {
                            var data = {};
                            data.banners = banners;
                            data.categories = kitchens;
                            data.featuredKitchens = kitchensFeatured;
                            data.featuredMeals = Meals;
                            resolve(data);
                        })
                    })

                })
            }, error => {
                reject(error);
            });
        });
    },
};