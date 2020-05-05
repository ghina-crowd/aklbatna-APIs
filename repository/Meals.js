var models = require('../models/models.js');
var commonRepository = require('./common.js');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var lang = require('../app');
var Meals, Category, kitchens, Type;

var MealRepository = {
    getByKitchenId: function (user_id, kitchen_id, page) {



        var pageSize = 12; // page start from 0
        const offset = page * pageSize;

        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
        }

        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.findAll({
                attributes: Meals, limit: pageSize, offset: offset, where: { active: 1, kitchen_id: kitchen_id }, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getByKitchenIdWithoutPagination: function (kitchen_id) {


        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.findAll({
                where: { kitchen_id: kitchen_id }, include: [{ model: models.kitchens }, { model: models.Categories }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get: function (meal_id, user_id) {
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
        }

        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
            models.Meals.findOne({
                attributes: Meals, where: { meal_id: meal_id }, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve({});
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAllAdmin: function (user_id) {

        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.findAll({
                where: { active: 1 }, include: [{ model: models.kitchens }, { model: models.Categories }, {
                    required: false,
                    model: models.Favourite,
                    where: {
                        user_id: user_id
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getAdmin: function (meal_id, user_id) {

        return new Promise(function (resolve, reject) {

            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.belongsTo(models.Menu, { foreignKey: 'menu_id' });
            models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });

            models.Meals.findOne({
                where: { meal_id: meal_id },
                include: [
                    { model: models.kitchens },
                    { model: models.Type },
                    { model: models.Menu },
                    { model: models.Categories },
                    {
                        required: false,
                        model: models.Favourite,
                        where: {
                            user_id: user_id
                        }
                    }
                ]
            }).then((Meals => {
                if (Meals == null) {
                    resolve({});
                } else {

                    models.Favourite.findAll({
                        where: { meal_id: meal_id }
                    }).then(Favourites => {
                        if (Favourites == null) {
                            resolve(null);
                        } else {
                            Meals['dataValues'].favouriteCount = Favourites.length;
                            resolve(Meals);
                        }
                    }, error => {
                        reject(error);
                    });

                }
            }), error => {
                reject(error);
            })
        });
    },
    getAll: function (page, sortBy, user_id) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_ar', 'name'], 'active'];
        }
        var order = [];

        if (sortBy == 0) {
            order.push(['total_served', 'DESC'])
        }

        if (sortBy == 1) {
            order.push(['final_rate', 'DESC'])
        }

        models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
        models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
        models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Meals.findAndCountAll({
                attributes: Meals, where: { active: 1 }, limit: pageSize, offset: offset, order: order, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                },
                {
                    model: models.Type, attributes: Type, where: {
                        active: 1
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    var reviewsTemp = Meals.rows;
                    Meals.Meals = reviewsTemp;
                    delete Meals.rows;
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get_featured: function (page, sortBy, user_id, pageCount) {
        var pageSize = Number(pageCount); // page start from 0
        const offset = page * pageSize;
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_ar', 'name'], 'active'];
        }
        var order = [];

        if (sortBy == 0) {
            order.push(['total_served', 'DESC'])
        }

        if (sortBy == 1) {
            order.push(['final_rate', 'DESC'])
        }

        models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
        models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
        models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Meals.findAll({
                attributes: Meals, where: { active: 1, featured: 1 }, limit: pageSize, offset: offset, order: order, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                },
                {
                    model: models.Type, attributes: Type, where: {
                        active: 1
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get_featuredHome: function (page, sortBy, user_id) {
        var pageSize = 6; // page start from 0
        const offset = page * pageSize;
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_ar', 'name'], 'active'];
        }
        var order = [];

        if (sortBy == 0) {
            order.push(['total_served', 'DESC'])
        }
        if (!sortBy) {
            order.push(['total_served', 'DESC'])
        }

        if (sortBy == 1) {
            order.push(['final_rate', 'DESC'])
        }

        models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
        models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
        models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Meals.findAll({
                attributes: Meals, where: { active: 1, featured: 1 }, limit: pageSize, offset: offset, order: order, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                },
                {
                    model: models.Type, attributes: Type, where: {
                        active: 1
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get_related_meals: function (category_id, user_id) {
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_ar', 'name'], 'active'];
        }
        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' })
            models.Meals.findAll({
                limit: 4,
                attributes: Meals,
                where: {
                    active: 1, category_id: category_id
                }, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                },
                {
                    model: models.Type, attributes: Type, where: {
                        active: 1
                    }
                }]
            }).then(meals => {
                if (meals == null) {
                    resolve(null);
                } else {
                    resolve(meals);
                }
            }, error => {
                reject(error);
            });
        });
    },
    filters: function (filters, user_id) {
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_en', 'name'], 'active'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_ar', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
            Type = [['name_ar', 'name'], 'active'];
        }



        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;

        var data = {}
        if (filters.rating) {
            data.final_rate = {
                [Op.gte]: rating
            }
        }

        if (filters.category_id) {
            data.category_id = filters.category_id
        }
        if (filters.kitchen_id) {
            data.kitchen_id = filters.kitchen_id
        }
        if (filters.type && filters.type !== '0' && filters.type !== 0) {
            data.type = filters.type
        }
        if (filters.keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.name_en = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            } else {
                data.name_ar = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            }
        }


        var order = [];

        if (filters.sort_by) {
            if (filters.sort_by == 3) {
                order.push(['price', 'ASC'])
            } else if (filters.sort_by == 4) {
                order.push(['price', 'DESC'])
            } else if (filters.sort_by == 2) {
                order.push(['final_rate', 'DESC'])
            } else if (filters.sort_by == 5) {
                order.push(['total_served', 'DESC'])
            } else if (filters.sort_by == 1) {
                order.push(['featured', 'DESC'])
            }
        }

        models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
        models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
        models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Meals.findAndCountAll({
                attributes: Meals, limit: pageSize, offset: offset, order: order, where: data, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                },
                {
                    model: models.Type, attributes: Type, where: {
                        active: 1
                    }
                }
                ]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    var reviewsTemp = Meals.rows;
                    Meals.Meals = reviewsTemp;
                    delete Meals.rows;
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    filtersAdmin: function (filters, user_id) {


        var pageSize = 12; // page start from 0
        const offset = filters.page * pageSize;

        var data = {}
        if (filters.rating) {
            data.final_rate = {
                [Op.gte]: rating
            }
        }

        if (filters.category_id) {
            data.category_id = filters.category_id
        }
        if (filters.kitchen_id) {
            data.kitchen_id = filters.kitchen_id
        }
        if (filters.type && filters.type !== '0' && filters.type !== 0) {
            data.type = filters.type
        }
        if (filters.keyword) {
            if (lang.acceptedLanguage == 'en') {
                data.name_en = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            } else {
                data.name_ar = {
                    [Op.like]: '%' + filters.keyword + '%'
                }
            }
        }


        var order = [];

        if (filters.sort_by) {
            if (filters.sort_by == 3) {
                order.push(['price', 'ASC'])
            } else if (filters.sort_by == 4) {
                order.push(['price', 'DESC'])
            } else if (filters.sort_by == 2) {
                order.push(['final_rate', 'DESC'])
            } else if (filters.sort_by == 5) {
                order.push(['total_served', 'DESC'])
            } else if (filters.sort_by == 1) {
                order.push(['featured', 'DESC'])
            }
        }

        models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
        models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
        models.Meals.belongsTo(models.Type, { foreignKey: 'type', targetKey: 'type_id' });
        models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
        return new Promise(function (resolve, reject) {
            models.Meals.findAndCountAll({
                limit: pageSize, offset: offset, order: order, where: data, include: [{ model: models.kitchens }, { model: models.Categories }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                },
                {
                    model: models.Type
                }
                ]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    var reviewsTemp = Meals.rows;
                    Meals.Meals = reviewsTemp;
                    delete Meals.rows;
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    get: function (meal_id, user_id) {
        if (lang.acceptedLanguage == 'en') {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_en', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_en', 'name'], ['description_en', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
        } else {
            kitchens = ['kitchen_id', 'category_id', ['name_en', 'name'], 'user_id', 'image', ['description_ar', 'description'], 'final_rate', 'start_time', 'end_time', 'served_count', 'featured', 'final_order_pakaging_rate', 'final_value_rate', 'final_delivery_rate', 'final_quality_rate', 'busy', 'is_delivery', 'is_delivery'];
            Category = ['category_id', ['name_ar', 'name'], 'active', 'image'];
            Meals = ['meal_id', ['name_ar', 'name'], ['description_ar', 'description'], 'menu_id', 'image', 'price_weekly', 'type', 'price', 'price_monthly', 'total_served', 'category_id', 'kitchen_id', 'featured', 'final_rate'];
        }

        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.hasOne(models.Favourite, { foreignKey: 'meal_id' });
            models.Meals.belongsTo(models.Categories, { foreignKey: 'category_id' });
            models.Meals.findOne({
                attributes: Meals, where: { meal_id: meal_id }, include: [{ model: models.kitchens, attributes: kitchens }, { model: models.Categories, attributes: Category }, {
                    required: false,
                    model: models.Favourite, where: {
                        user_id: user_id
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve({});
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    getSpCount: function (user_id) {

        console.log('user_id',user_id);
        return new Promise(function (resolve, reject) {
            models.Meals.belongsTo(models.kitchens, { foreignKey: 'kitchen_id' });
            models.Meals.findAll({
                include: [{
                    required: true,
                    model: models.kitchens, where: {
                        user_id: user_id
                    }
                }]
            }).then((Meals => {
                if (Meals == null) {
                    resolve([]);
                } else {
                    resolve(Meals);
                }
            }), error => {
                reject(error);
            })
        });
    },
    create: function (newMeals) {
        console.log(newMeals);
        return new Promise(function (resolve, reject) {
            models.Meals.create({
                name_ar: newMeals.name_ar,
                name_en: newMeals.name_en,
                menu_id: newMeals.menu_id,
                image: newMeals.image,
                type: newMeals.type,
                price: newMeals.price,
                active: newMeals.active,
                price_monthly: newMeals.price_monthly,
                price_weekly: newMeals.price_weekly,
                kitchen_id: newMeals.kitchen_id,
                category_id: newMeals.category_id,
                total_served: 0,
                active: 1,
                description_ar: newMeals.description_ar,
                description_en: newMeals.description_en
            }).then(meal => {
                resolve(meal);
            }, error => {
                reject(error)
            });
        });
    },
    update: function (newMeals) {

        return new Promise(function (resolve, reject) {
            models.Meals.update({
                name_ar: newMeals.name_ar,
                name_en: newMeals.name_en,
                menu_id: newMeals.menu_id,
                image: newMeals.image,
                type: newMeals.type,
                price: newMeals.price,
                active: newMeals.active,
                price_monthly: newMeals.price_monthly,
                price_weekly: newMeals.price_weekly,
                kitchen_id: newMeals.kitchen_id,
                category_id: newMeals.category_id,
                active: newMeals.active,
            }, { where: { meal_id: newMeals.meal_id } }).then(meal => {
                models.Meals.findOne({ where: { meal_id: newMeals.meal_id } }).then((Meals => {
                    if (Meals == null) {
                        resolve({});
                    } else {
                        resolve(Meals);
                    }
                }), error => {
                    reject(error);
                })
            }, error => {
                reject(error)
            });
        });
    },
    delete: function (meal_id) {
        return new Promise(function (resolve, reject) {
            models.Meals.destroy({ where: { meal_id: meal_id } }).then(deleted => {
                resolve(deleted);
            }, error => {
                reject(error);
            });
        });
    },
    get_Reviews: function (page, meal_id) {
        var pageSize = 12; // page start from 0
        const offset = page * pageSize;
        return new Promise(function (resolve, reject) {
            models.Reviews.belongsTo(models.User, { foreignKey: 'user_id', targetKey: 'user_id' });
            models.Reviews.findAndCountAll({
                limit: pageSize,
                offset: offset,
                order: [['date', 'DESC']],
                where: { meal_id: meal_id },
                include: [{
                    model: models.User,
                    attributes: ['user_id', 'first_name', 'last_name', 'profile', 'email']
                }],
            }).then(reviews => {
                if (reviews == null) {
                    resolve(null);
                } else {
                    var reviewsTemp = reviews.rows;
                    reviews.reviews = reviewsTemp;
                    delete reviews.rows;
                    resolve(reviews);
                }
            }, error => {
                reject(error);
            });
        });
    },
    create_review: async function (newReviewData) {
        return new Promise(async function (resolve, reject) {
            models.Reviews.create({
                user_id: newReviewData.user_id,
                meal_id: newReviewData.meal_id,
                final_rate: newReviewData.final_rate,
                comment: newReviewData.comment,
            }).then(async rate => {
                if (rate == null) {
                    resolve(null);
                } else {
                    resolve(rate);
                    models.Reviews.findAll({
                        attributes: ['meal_id', [sequelize.fn('SUM', sequelize.col('final_rate')), 'sum_rate'], [sequelize.fn('COUNT', sequelize.col('final_rate')), 'count_rate']]
                        , where: { meal_id: newReviewData.meal_id }
                    }).then(async Reviews => {
                        if (Reviews == null) {
                            resolve(null);
                        } else {
                            var final_rate = Reviews[0].dataValues['sum_rate'] / Reviews[0].dataValues['count_rate'];
                            final_rate = final_rate.toFixed(1);
                            models.Meals.update(
                                { final_rate: final_rate }, { where: { meal_id: newReviewData.meal_id } }
                            ).then(function (result) {
                                resolve(result);
                            }, function (error) {
                                reject(error);
                            });

                        }
                    }, error => {
                        reject(error);
                    });
                }
            }, error => {
                reject(error);
            });
        });
    },

};




Object.assign(MealRepository, commonRepository);
module.exports = MealRepository;