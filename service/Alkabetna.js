var BannersRepository = require('../repository/Banners');

var ConstrainsRepository = require('../repository/Constrains');
var CategoryRepository = require('../repository/Category');
var KitchensRepository = require('../repository/Kitchen');
var MealsRepository = require('../repository/Meals');
var UsersRepository = require('../repository/users');
var OrderRepository = require('../repository/Order');
var OffersRepository = require('../repository/Offers');


module.exports = {
    home: async function (id) {
        return new Promise(async function (resolve, reject) {
            BannersRepository.get().then(banners => {
                CategoryRepository.get_categories().then((kitchens) => {
                    KitchensRepository.get_featured(0).then((kitchensFeatured) => {
                        MealsRepository.get_featuredHome(0, 0, id).then((Meals) => {
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
    homeAdmin: async function () {
        return new Promise(async function (resolve, reject) {
            BannersRepository.getCount().then(getBannerCount => {
                UsersRepository.getCountNormal().then((getCountNormal) => {
                    UsersRepository.getCountSp().then((getCountSp) => {
                        UsersRepository.getCountAdmin().then((getCountAdmin) => {
                            KitchensRepository.getAllCount().then((getAllKitchensCount) => {
                                KitchensRepository.getAllCountActive().then((getAllCountActive) => {
                                    KitchensRepository.getAllCountUnactive().then((getAllCountUnactive) => {
                                        var data = {};
                                        data.BannerCount = getBannerCount.length;
                                        data.CountNormal = getCountNormal.length;
                                        data.CountNormal = getCountNormal.length;
                                        data.CountSp = getCountSp.length;
                                        data.CountAdmin = getCountAdmin.length;
                                        data.KitchensKitchensCount = getAllKitchensCount.length;
                                        data.KitchensCountActive = getAllCountActive.length;
                                        data.KitchensCountUnactive = getAllCountUnactive.length;
                                        resolve(data);
                                    })
                                })
                            })
                        })
                    })

                })
            }, error => {
                reject(error);
            });
        });
    },
    homeSP: async function (id) {
        return new Promise(async function (resolve, reject) {
            MealsRepository.getSpCount(id).then(MealCount => {
                OffersRepository.getSpCount(id).then((OfferCount) => {
                    OrderRepository.getSpCountAll(id).then((OrderCount) => {
                        OrderRepository.getSpCount(id, 0).then((pendingOrderCount) => {
                            OrderRepository.getSpCount(id, 1).then((PreparingOrderCount) => {
                                OrderRepository.getSpCount(id, 2).then((CompletedOrderCount) => {
                                    OrderRepository.getSpCount(id, 3).then((CanceledOrderCount) => {
                                        var data = {};
                                        data.MealCount = MealCount.length;
                                        data.OfferCount = OfferCount.length;
                                        data.OrderCount = OrderCount.length;
                                        data.pendingOrderCount = pendingOrderCount.length;
                                        data.PreparingOrderCount = PreparingOrderCount.length;
                                        data.CompletedOrderCount = CompletedOrderCount.length;
                                        data.CanceledOrderCount = CanceledOrderCount.length;
                                        resolve(data);
                                    })
                                })
                            })
                        })
                    })

                })
            }, error => {
                reject(error);
            });
        });
    },
    getConstrains: async function () {
        return new Promise(async function (resolve, reject) {
            ConstrainsRepository.getConstrains().then(constrains => {
                resolve(constrains);
            }, error => {
                reject(error);
            });
        });
    },
    updateConstrains: async function (constrains) {
        return new Promise(async function (resolve, reject) {
            ConstrainsRepository.updateConstrains(constrains).then(constrains => {
                resolve(constrains);
            }, error => {
                reject(error);
            });
        });
    },
};